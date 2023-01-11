/**
 *
 *
 *
 */


import { User } from '../../services/adm/UsersService';


export interface IRawPresentation {
  id: number;
  topic_type: 'presentation';
  title: string;
  description: string;
  parent_id: number;   // | null;
  user_id: number;
  config: any;
  created: string;
  updated: string;
  _is_mine: boolean;
  users: number[];
}


export interface ISlideModel {
  loading: boolean;
  error: string;

  id: number;
  topic_id: number;

  title: string;
  description: string;
  context: any;                                       // IUrl
  tinyImageUrl: string;
  // folder: IPresentationModel;

  index: KnockoutObservable<number>;
  total: KnockoutObservable<number>;
}


export interface IPresentationModel {
  loading: boolean;
  error: string;

  id: number;
  userId: number;

  created: Date;
  isMine: boolean;

  pdfUrl: string;
  pptxUrl: string;

  title: string;
  description: string;

  users: KnockoutObservableArray<User>;
  author: KnockoutObservable<User>;
}
