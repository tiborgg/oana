import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import WithInputPlugin from '@pothos/plugin-with-input';
import ZodPlugin from '@pothos/plugin-zod';
import { PrismaClient } from '@repo/database/prisma';
import type PrismaTypes from '@repo/database/pothos';
import { DateTimeISOResolver, JSONResolver, UUIDResolver } from "graphql-scalars";
import cuid from 'cuid';
import dayjs from 'dayjs';

interface ReportItemInventory {
  inInventory: number;
  yearInQuantity: number;
  inQuantity: number;
  outQuantity: number;
  outInventory: number;
}

type PrismaReportItem = PrismaTypes['ReportItem']['Shape'];

type PrismaReport =
  PrismaTypes['Report']['Shape'] & {
    items: PrismaReportItem[];
  };

type PrismaProduct = PrismaTypes['Product']['Shape'];

type ComputeReportItemInventoryParams = {
  item: PrismaReportItem;
  report: PrismaReport;
  previousReports: PrismaReport[];
}

function computeReportItemInventory({
  item,
  report,
  previousReports
}: ComputeReportItemInventoryParams): ReportItemInventory {

  const productId = item.productId;
  const yearPreviousReports = previousReports.filter(prevReport => prevReport.year === report.year);

  const inInventory = previousReports.reduce((acc, prevReport) => {
    const prevItem = prevReport.items.find(prevItem => prevItem.productId === productId);

    const prevInQt = prevItem?.inQuantity ?? 0;
    const prevOutQt = prevItem?.outQuantity ?? 0;
    
    return acc + prevInQt - prevOutQt;
  }, 0);

  const yearInQuantity = yearPreviousReports.reduce((acc, yearPrevReport) => {
    const prevItem = yearPrevReport.items.find(prevItem => prevItem.productId === productId);
    const prevInQt = prevItem?.inQuantity ?? 0;
    
    return acc + prevInQt;
  }, 0);

  return {
    inInventory: inInventory,
    yearInQuantity: yearInQuantity + item.inQuantity,
    inQuantity: item.inQuantity,
    outQuantity: item.outQuantity,
    outInventory: inInventory + item.inQuantity - item.outQuantity,
  }
}

async function resolveReport(report: PrismaReport) {

  // fetch all previous reports
  const previousReports = await prisma.report.findMany({
    where: {
      OR: [
        {
          year: {
            lt: report.year
          }
        },
        {
          year: report.year,
          month: {
            lt: report.month
          }
        }
      ]
    },
    include: {
      items: true
    }
  });

  const date = dayjs.utc({
    year: report.year,
    month: report.month,
    date: 1
  });
  const productCutoffDate = date.endOf('month').toDate();

  const products = await prisma.product.findMany({
    where: {
      registeredAt: { lte: productCutoffDate }
    }
  });

  const productOrderIndexLookup = new Map<string, number>();

  products.forEach((product, index) => {
    productOrderIndexLookup.set(product.id, index);
  });

  const items: PrismaReportItem[] = report?.items ?? [];

  const pendingItems: PrismaReportItem[] = products
    .filter(product =>
      !items.find(item => item.productId === product.id))
    .map(product => {
      return {
        createdAt: dayjs.utc().toDate(),
        updatedAt: dayjs.utc().toDate(),
        reportId: report.id,
        report: report,
        productId: product.id,
        product: product,
        orderIndex: productOrderIndexLookup.get(product.id) ?? -1,
        isPending: true,
        inQuantity: 0,
        outQuantity: 0
      }
    });

  items.forEach(item => {
    const resolvedItem: any = item;
    const {  
      inInventory,
      yearInQuantity,
      inQuantity,
      outQuantity,
      outInventory
    } = computeReportItemInventory({
      report,
      previousReports,
      item
    });

    resolvedItem.isPending = false;
    resolvedItem.orderIndex = productOrderIndexLookup.get(item.productId) ?? -1;
    resolvedItem.inInventory = inInventory;
    resolvedItem.yearInQuantity = yearInQuantity;
    resolvedItem.inQuantity = inQuantity;
    resolvedItem.outQuantity = outQuantity;
    resolvedItem.outInventory = outInventory;

    console.log(resolvedItem);
  });

  pendingItems.forEach(item => {
    const resolvedItem: any = item;
    const { 
      inInventory,
      yearInQuantity,
      inQuantity,
      outQuantity,
      outInventory
    } = computeReportItemInventory({
      report,
      previousReports,
      item
    });
    
    resolvedItem.inInventory = inInventory;
    resolvedItem.yearInQuantity = yearInQuantity;
    resolvedItem.inQuantity = inQuantity;
    resolvedItem.outQuantity = outQuantity;
    resolvedItem.outInventory = outInventory;
  });

  (report as any).pendingItems = pendingItems;
  return report;
}


const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: { prisma: PrismaClient };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    ID: {
      Input: string;
      Output: string;
    };
    JSON: {
      Input: unknown;
      Output: unknown;
    };
  };
}>({
  plugins: [PrismaPlugin, WithInputPlugin, ZodPlugin],
  prisma: {
    client: prisma,
  },
});

builder.addScalarType("DateTime", DateTimeISOResolver, {
  parseValue: (value) => {
    console.log('parseValue', value);
    const date = new Date(value as string);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date format');
    }
    return date;
  },
});

// scalars
builder.addScalarType("ID", UUIDResolver);
builder.addScalarType("JSON", JSONResolver);




// --- Product ---
const Product = builder.prismaObject('Product', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    unit: t.exposeString('unit', { nullable: true }),
    packagingType: t.exposeString('packagingType', { nullable: true }),
    storageType: t.exposeString('storageType', { nullable: true }),
    usageType: t.exposeString('usageType', { nullable: true }),
    observations: t.exposeString('observations', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    registeredAt: t.expose('registeredAt', { type: 'DateTime' }),
    items: t.relation('items'),
  }),
});


// --- ReportItem ---
builder.prismaObject('ReportItem', {
  fields: (t) => ({
    reportId: t.exposeString('reportId'),
    productId: t.exposeString('productId'),
    inQuantity: t.exposeFloat('inQuantity'),
    outQuantity: t.exposeFloat('outQuantity'),
    report: t.relation('report'),
    product: t.relation('product'),
    orderIndex: t.field({
      type: 'Int',
      resolve: (parent: any) =>
        parent?.orderIndex
    }),
    isPending: t.field({
      type: 'Boolean',
      resolve: (parent: any) =>
        parent?.isPending
    }),
    yearInQuantity: t.field({
      type: 'Float',
      resolve: (parent: any) => 
        parent?.yearInQuantity
    }),
    inInventory: t.field({
      type: 'Float',
      resolve: (parent: any) =>
        parent?.inInventory
    }),
    outInventory: t.field({
      type: 'Float',
      resolve: (parent: any) => 
        parent?.outInventory
    }),
  }),
});

interface PendingReportItem {
  reportId: string;
  productId: string;
  quantity: number;
  product: PrismaProduct;
  orderIndex: number;
  isPending: true;
  inInventory: number;
  inQuantity: number;
  yearInQuantity: number;
  outQuantity: number;
  outInventory: number;
}

const PendingReportItem = builder.objectRef<PendingReportItem>('PendingReportItem');

builder.objectType(PendingReportItem, {
  fields: (t) => ({
    reportId: t.exposeString('reportId'),
    productId: t.exposeString('productId'),
    product: t.expose('product', { type: Product }),
    orderIndex: t.expose('orderIndex', { type: 'Int' }),
    isPending: t.expose('isPending', { type: 'Boolean' }),
    inInventory: t.expose('inInventory', { type: 'Float' }),
    yearInQuantity: t.expose('yearInQuantity', { type: 'Float' }),
    inQuantity: t.expose('inQuantity', { type: 'Float' }),
    outQuantity: t.expose('outQuantity', { type: 'Float' }),
    outInventory: t.expose('outInventory', { type: 'Float' }),
  }),
});

// --- Report ---
builder.prismaObject('Report', {
  fields: (t) => ({
    id: t.exposeID('id'),
    year: t.expose('year', { type: 'Int' }),
    month: t.expose('month', { type: 'Int' }),
    items: t.relation('items'),
    pendingItems: t.field({
      type: [PendingReportItem],
      resolve: (query, parent, _args, ctx) => {
        return (query as any)?.pendingItems ?? [];
      },
    }),
  }),
});

// --- Queries ---
builder.queryFields((t) => ({
  products: t.prismaField({
    type: ['Product'],
    resolve: (query, _parent, _args, ctx) => prisma.product.findMany({ ...query }),
  }),
  reports: t.prismaField({
    type: ['Report'],
    resolve: async (query, _parent, _args, ctx) => {
      const report = await prisma.report.findMany({ ...query })
      return report;
    }
  }),
  reportItems: t.prismaField({
    type: ['ReportItem'],
    resolve: (query, _parent, _args, ctx) => prisma.reportItem.findMany({ ...query }),
  }),
  product: t.prismaField({
    type: 'Product',
    args: { id: t.arg.string({ required: true }) },
    resolve: (query, _parent, args, ctx) => prisma.product.findUnique({ ...query, where: { id: args.id } }),
  }),
  report: t.prismaField({
    type: 'Report',
    args: {
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true })
    },
    resolve: async (query, _parent, args, ctx) => {
      const report = await prisma.report.findFirst({
        ...query,
        where: {
          year: args.year,
          month: args.month
        },
        include: {
          items: true
        }
      })

      if (!report)
        return null;

      await resolveReport(report);

      return report;
    }
  }),
}));

const ProductInput = builder.inputType('ProductInput', {
  fields: (t) => ({
    id: t.id(),
    name: t.string({ required: true }),
    unit: t.string(),
    packagingType: t.string(),
    storageType: t.string(),
    usageType: t.string(),
    observations: t.string(),
    registeredAt: t.field({ type: 'DateTime' })
  }),
});

const ReportItemInput = builder.inputType('ReportItemInput', {
  fields: (t) => ({
    productId: t.string({ required: true }),
    inQuantity: t.float({ required: true }),
    outQuantity: t.float({ required: true })
  }),
});

// --- Mutations ---
builder.mutationField('syncProducts', t => {
  return t.prismaFieldWithInput({
    type: ['Product'],
    input: {
      upsertProducts: t.input.field({
        type: [ProductInput],
        required: true
      }),
      deleteProductIds: t.input.field({
        type: ['String'],
        required: true
      }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { input } = args;
      const { upsertProducts, deleteProductIds } = input;

      await prisma.$transaction([
        ...upsertProducts.map(productInput => {

          return prisma.product.upsert({
            where: {
              id: productInput.id ?? cuid(),
            },
            create: {
              name: productInput.name,
              unit: productInput.unit,
              packagingType: productInput.packagingType,
              storageType: productInput.storageType,
              usageType: productInput.usageType,
              observations: productInput.observations,
              createdAt: dayjs.utc().toDate(),
              updatedAt: dayjs.utc().toDate(),
              registeredAt: productInput.registeredAt ?? dayjs.utc().toDate()
            },
            update: {
              name: productInput.name,
              unit: productInput.unit,
              packagingType: productInput.packagingType,
              storageType: productInput.storageType,
              usageType: productInput.usageType,
              observations: productInput.observations,
              updatedAt: dayjs.utc().toDate(),
              registeredAt: productInput.registeredAt ?? dayjs.utc().toDate()
            }
          })
        }),

        ...deleteProductIds.map(productId => {

          return prisma.product.delete({
            where: {
              id: productId,
            }
          })
        })
      ]);

      return prisma.product.findMany();
    }
  });
});


builder.mutationField('syncReport', t => {
  return t.prismaFieldWithInput({
    type: 'Report',
    input: {
      id: t.input.field({
        type: 'String',
        required: true
      }),
      upsertReportItems: t.input.field({
        type: [ReportItemInput],
        required: true
      }),
      deleteReportItemIds: t.input.field({
        type: ['String'],
        required: true
      }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { input } = args;
      const { id: reportId, upsertReportItems, deleteReportItemIds } = input;

      await prisma.$transaction([
        ...upsertReportItems.map(reportItemInput => {

          return prisma.reportItem.upsert({
            where: {
              reportId_productId: {
                reportId: reportId,
                productId: reportItemInput.productId,
              }
            },
            create: {
              reportId: reportId,
              productId: reportItemInput.productId,
              inQuantity: reportItemInput.inQuantity,
              outQuantity: reportItemInput.outQuantity,
              createdAt: dayjs.utc().toDate(),
              updatedAt: dayjs.utc().toDate(),
            },
            update: {
              inQuantity: reportItemInput.inQuantity,
              outQuantity: reportItemInput.outQuantity,
              updatedAt: dayjs.utc().toDate(),
            }
          })
        }),

        ...deleteReportItemIds.map(productId => {

          return prisma.reportItem.delete({
            where: {
              reportId_productId: {
                reportId: reportId,
                productId: productId,
              }
            }
          })
        })
      ]);

      const report = await prisma.report.findUnique({
        where: {
          id: reportId,
        },
        include: {
          items: true,
        }
      });

      if (!report)
        return null;

      await resolveReport(report);

      return report;
    }
  });
});





builder.mutationField('createReport', t => {
  return t.prismaField({
    type: 'Report',
    args: {
      year: t.arg({ type: 'Int', required: true }),
      month: t.arg({ type: 'Int', required: true }),
    },
    resolve: (query, _parent, args, ctx) =>
      prisma.report.create({
        ...query,
        data: {
          year: args.year,
          month: args.month,
        },
      })
  });
});

// Define root query / mutation
builder.queryType({
  description: "Root Query",
});

builder.mutationType({
  description: "Root Mutation",
});

export const schema = builder.toSchema();
