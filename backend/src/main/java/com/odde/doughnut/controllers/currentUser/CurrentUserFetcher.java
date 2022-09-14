package com.odde.doughnut.controllers.currentUser;

import com.odde.doughnut.entities.*;
import com.odde.doughnut.exceptions.NoAccessRightException;
import com.odde.doughnut.models.UserModel;

public interface CurrentUserFetcher {
  UserModel getUser();

  String getExternalIdentifier();

  default User getUserEntity() {
    return getUser().getEntity();
  }

  default <T> void assertAuthorization(T object) throws NoAccessRightException {
    getUser().assertAuthorization(object);
  }

  default <T> void assertReadAuthorization(T object) throws NoAccessRightException {
    getUser().assertReadAuthorization(object);
  }

  default void assertDeveloperAuthorization() throws NoAccessRightException {
    getUser().assertDeveloperAuthorization();
  }

  default void assertLoggedIn() {
    getUser().assertLoggedIn();
  }
}
