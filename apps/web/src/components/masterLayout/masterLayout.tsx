import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { MasterLayoutState } from './masterLayoutState';
import { SidebarProvider } from '../ui/sidebar';
import { MasterSidebar } from '../masterSidebar';
import { MasterInset } from '../masterInset';

export const MasterLayout = observer(() => {

  const [model] = useState(() => new MasterLayoutState());

  useEffect(() => {
    model.mounted();
    return () =>
      model.unmounted();
  }, [model]);

  return (
    <SidebarProvider
      defaultOpen={model.isSidebarOpen}
      open={model.isSidebarOpen}
      onOpenChange={model.handleSidebarOpenChange}>

      <MasterSidebar />
      <MasterInset />
    </SidebarProvider>
  );
});