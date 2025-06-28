export type AbsoluteUrlString = 
  `${string}://${string}`;

export type RelativeUrlString = string;

export type URLValue = URL | AbsoluteUrlString | RelativeUrlString;