package com.odde.doughnut.controllers;

import com.odde.doughnut.controllers.dto.InitialInfo;
import com.odde.doughnut.controllers.dto.OnboardingCountDTO;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.MemoryTrackerModel;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.services.OnboardingService;
import com.odde.doughnut.testability.TestabilitySettings;
import jakarta.annotation.Resource;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.SessionScope;

@RestController
@SessionScope
@RequestMapping("/api/memory-tracker-onboarding")
class MemoryTrackerOnboardingController {
  private final ModelFactoryService modelFactoryService;
  private final UserModel currentUser;

  @Resource(name = "testabilitySettings")
  private final TestabilitySettings testabilitySettings;

  public MemoryTrackerOnboardingController(
      ModelFactoryService modelFactoryService,
      UserModel currentUser,
      TestabilitySettings testabilitySettings) {
    this.modelFactoryService = modelFactoryService;
    this.currentUser = currentUser;
    this.testabilitySettings = testabilitySettings;
  }

  @GetMapping("/onboarding")
  @Transactional(readOnly = true)
  public List<Note> onboarding(@RequestParam(value = "timezone") String timezone) {
    currentUser.assertLoggedIn();
    ZoneId timeZone = ZoneId.of(timezone);
    Timestamp currentUTCTimestamp = testabilitySettings.getCurrentUTCTimestamp();

    return new OnboardingService(currentUser,modelFactoryService, currentUTCTimestamp, timeZone)
        .getDueInitialMemoryTrackers()
        .toList();
  }

  @PostMapping(path = "")
  @Transactional
  public MemoryTracker onboard(@RequestBody InitialInfo initialInfo) {
    currentUser.assertLoggedIn();
    MemoryTracker memoryTracker =
        MemoryTracker.buildMemoryTrackerForNote(
            modelFactoryService.entityManager.find(Note.class, initialInfo.noteId));
    memoryTracker.setRemovedFromTracking(initialInfo.skipMemoryTracking);

    MemoryTrackerModel memoryTrackerModel = modelFactoryService.toMemoryTrackerModel(memoryTracker);
    memoryTrackerModel.onboard(
        testabilitySettings.getCurrentUTCTimestamp(), currentUser.getEntity());
    return memoryTrackerModel.getEntity();
  }

  @GetMapping("/count")
  @Transactional(readOnly = true)
  public OnboardingCountDTO getOnboardingCount(@RequestParam(value = "timezone") String timezone) {
    currentUser.assertLoggedIn();
    ZoneId timeZone = ZoneId.of(timezone);
    Timestamp currentUTCTimestamp = testabilitySettings.getCurrentUTCTimestamp();

    return new OnboardingService(currentUser, modelFactoryService, currentUTCTimestamp, timeZone)
        .getOnboardingCounts();
  }
}
