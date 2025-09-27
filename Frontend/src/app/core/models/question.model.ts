export interface QuestionListItem {
  questionId: number;
  questionTitle: string;
  questionText: string;
  status: string;
  author: string;
  images?: { imageId:number; path:string }[];
}

export interface QuestionDetail {
  questionId: number;
  questionTitle: string;
  questionText: string;
  status: string;
  author: string;
  questionImages: { imageId:number; path:string }[];
  answers: {
    answerId:number;
    answerText:string;
    status:string;
    author:string;
    answerImages: { imageId:number; path:string }[];
  }[];
}

export interface CreateQuestion { questionTitle:string; questionText:string; }
