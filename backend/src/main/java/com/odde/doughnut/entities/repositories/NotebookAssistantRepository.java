package com.odde.doughnut.entities.repositories;

import com.odde.doughnut.entities.Notebook;
import com.odde.doughnut.entities.NotebookAssistant;
import org.springframework.data.repository.CrudRepository;

public interface NotebookAssistantRepository extends CrudRepository<NotebookAssistant, Integer> {
  NotebookAssistant findByNotebook(Notebook notebook);
}
