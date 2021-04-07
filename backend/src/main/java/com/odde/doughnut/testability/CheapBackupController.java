package com.odde.doughnut.testability;

import com.odde.doughnut.entities.NotebookEntity;
import com.odde.doughnut.entities.NoteEntity;
import com.odde.doughnut.services.ModelFactoryService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class CheapBackupController {
    private final ModelFactoryService modelFactoryService;

    public CheapBackupController(ModelFactoryService modelFactoryService) {
        this.modelFactoryService = modelFactoryService;
    }

    @GetMapping("/api/backup")
    @Transactional
    public HashMap<String, Object> backup() {
        HashMap<String, Object> hash = new HashMap<>();

        return hash;
    }

    @GetMapping("/api/db_migration_history")
    public List dbM(Model model) {
        return modelFactoryService.entityManager.createNativeQuery("select * from flyway_schema_history").getResultList();
    }

}

