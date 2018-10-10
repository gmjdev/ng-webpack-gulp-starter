import { ElementFinder, browser, by, element } from 'protractor';

describe('angularjs homepage todo list', () => {
  it('should add a todo', () => {
    // Test in Jasmine
    browser.get('https://angularjs.org'); // Entering application url in browser
    // Enter text under TODO
    element(by.model('todoList.todoText')).sendKeys(
      'write first protractor test'
    );
    element(by.css('[value="add"]')).click(); // Clicks on 'Add' button
    element.all(by.repeater('todo in')).then(todoList => {
      expect(todoList.length.toString()).toEqual('3');
      todoList[2]
        .getText()
        .then(text => expect(text).toEqual('write first protractor test'));
    });
  });
});
