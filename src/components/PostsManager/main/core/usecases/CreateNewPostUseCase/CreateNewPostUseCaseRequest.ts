export interface CreateNewPostUseCaseRequest {
  title: string;
  description: string;
  type: string;
  wilayaNumber: number;
  publisherId: string;

  // for families in need && call for helps
  ccp: string;
  ccpKey: string;
  edahabiaRIB: string;

  // for donations and donation requests
  category: string;
}
