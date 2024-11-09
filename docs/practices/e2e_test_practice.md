# E2E Testing Practices for Doughnut

## Technology Stack
- Cypress for E2E testing
- Cucumber plugin for BDD-style tests
- TypeScript for type safety and better IDE support

## Project Structure
- `e2e_test` contains all the tests
- `e2e_test/features` contains the BDD-style tests
- `e2e_test/step_definitions` contains the step definitions for the tests
- `e2e_test/start/` contains the page objects for the tests
- `e2e_test/support/` contains the support files for the tests

## Key Practices

### 1. BDD with Cucumber

- Write features in Gherkin syntax focusing on business value
- Group related features in domain-specific folders
- Use tags (e.g., `@usingMockedOpenAiService`, `@mockBrowserTime`) to control test execution
- Keep scenarios focused and concise

### 2. Step Definitions

- Keep step definitions lightweight
- Delegate implementation details to Page Objects
- Use TypeScript for better type safety
- Reuse steps across features when possible
- Use parameter types for complex objects

Example:
```typescript
When('I start a conversation about the note {string}', (noteTopic: string) => {
  start.jumpToNotePage(noteTopic).startAConversationAboutNote()
})
```

### 3. Page Object Pattern

- Centralize all UI interactions in page objects
- Chain methods for better readability
- Use TypeScript interfaces for better type checking
- Keep page objects focused on single responsibility
- Use meaningful method names that reflect user actions

Example:
```typescript
const notePage = {
  startAConversationAboutNote() {
    this.toolbarButton('Star a conversation').click()
    return conversationPage()
  }
}
```

### 4. Test Data Management

- Use Given steps to set up test data
- Mock external services when appropriate (e.g., OpenAI)
- Clean up test data after each test
- Use data tables for complex test data

Example:
```gherkin
Given there are some notes:
  | Topic    | Parent Topic | Skip Review |
  | Shape    |              | true        |
  | Square   | Shape        |             |
```

### 5. Service Mocking

- Mock external services (e.g., OpenAI) for reliable tests
- Use tags to indicate when mocks are required
- Keep mock responses consistent with real service behavior
- Store mock data separately from test code

Example:
```typescript
Given('OpenAI assistant will reply below for user messages:', (data: DataTable) => {
  mock_services.openAi()
    .stubCreateThread('thread-123')
    .createThreadAndStubMessages('thread-123', data.hashes())
})
```

### 6. Best Practices

1. **Test Organization**
   - Group related features in domain folders
   - Use meaningful file names
   - Keep scenarios focused on single functionality

2. **Code Quality**
   - Use TypeScript for better maintainability
   - Follow consistent naming conventions
   - Document complex test setups

3. **Maintainability**
   - Keep step definitions simple
   - Reuse page objects and helpers
   - Use meaningful descriptions in feature files
   - Document complex test scenarios

## Common Pitfalls to Avoid

1. Don't put complex logic in step definitions
2. Don't create long scenarios with many steps
3. Don't rely on test order
4. Don't use hardcoded waits
5. Don't skip error handling
6. Don't mix different levels of abstraction in scenarios