import ApiErrorBuilder from "./ApiErrorBuilder"
import BazaarNotebooksBuilder from "./BazaarNotebooksBuilder"
import CircleBuilder from "./CircleBuilder"
import CircleNoteBuilder from "./CircleNoteBuilder"
import DueReviewPointsBuilder from "./DueReviewPointsBuilder"
import LinkBuilder from "./LinkBuilder"
import NoteBuilder from "./NoteBuilder"
import NoteRealmBuilder from "./NoteRealmBuilder"
import NotebookBuilder from "./NotebookBuilder"
import PredefinedQuestionBuilder from "./PredefinedQuestionBuilder"
import ReviewQuestionInstanceBuilder from "./ReviewQuestionInstanceBuilder"
import ReviewPointBuilder from "./ReviewPointBuilder"
import SuggestedQuestionForFineTuningBuilder from "./SuggestedQuestionForFineTuningBuilder"
import UserBuilder from "./UserBuilder"
import WikidataEntityBuilder from "./WikidataEntityBuilder"
import WikidataSearchEntityBuilder from "./WikidataSearchEntityBuilder"
import AssessmentAttemptBuilder from "./AssessmentAttemptBuilder"
import AssessmentQuestionInstanceBuilder from "./AssessmentQuestionInstanceBuilder"

class MakeMe {
  static get aUser() {
    return new UserBuilder()
  }

  static get aNote(): NoteBuilder {
    return new NoteBuilder()
  }

  static get aNoteRealm(): NoteRealmBuilder {
    return new NoteRealmBuilder()
  }

  static get aReviewPoint(): ReviewPointBuilder {
    return new ReviewPointBuilder()
  }

  static get aLink(): LinkBuilder {
    return new LinkBuilder()
  }

  static get aDueReviewPointsList(): DueReviewPointsBuilder {
    return new DueReviewPointsBuilder()
  }

  static get aReviewQuestionInstance(): ReviewQuestionInstanceBuilder {
    return new ReviewQuestionInstanceBuilder()
  }

  static get anAssessmentQuestionInstance(): AssessmentQuestionInstanceBuilder {
    return new AssessmentQuestionInstanceBuilder()
  }

  static get aPredefinedQuestion(): PredefinedQuestionBuilder {
    return new PredefinedQuestionBuilder()
  }

  static get aCircleNote(): CircleNoteBuilder {
    return new CircleNoteBuilder()
  }

  static get aCircle(): CircleBuilder {
    return new CircleBuilder()
  }

  static get aNotebook(): NotebookBuilder {
    return new NotebookBuilder()
  }

  static get bazaarNotebooks(): BazaarNotebooksBuilder {
    return new BazaarNotebooksBuilder()
  }

  static get aWikidataEntity(): WikidataEntityBuilder {
    return new WikidataEntityBuilder()
  }

  static get anAssessmentAttempt(): AssessmentAttemptBuilder {
    return new AssessmentAttemptBuilder()
  }

  static get aWikidataSearchEntity(): WikidataSearchEntityBuilder {
    return new WikidataSearchEntityBuilder()
  }

  static get aSuggestedQuestionForFineTuning(): SuggestedQuestionForFineTuningBuilder {
    return new SuggestedQuestionForFineTuningBuilder()
  }

  static get anApiError(): ApiErrorBuilder {
    return new ApiErrorBuilder().error404()
  }
}

export default MakeMe
