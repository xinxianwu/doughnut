/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageWithMask } from './ImageWithMask';
import type { MultipleChoicesQuestion } from './MultipleChoicesQuestion';
export type PredefinedQuestion = {
    id: number;
    multipleChoicesQuestion: MultipleChoicesQuestion;
    checkSpell?: boolean;
    imageWithMask?: ImageWithMask;
    correctAnswerIndex?: number;
    approved?: boolean;
};
