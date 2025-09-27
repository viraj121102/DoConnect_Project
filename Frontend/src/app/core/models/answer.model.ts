export interface CreateAnswer { questionId:number; answerText:string; }
export interface AnswerListItem {
  answerId:number;
  answerText:string;
  status:string;
  author:string;
  images: { imageId:number; path:string }[];
}
