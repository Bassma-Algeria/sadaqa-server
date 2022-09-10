- add the ability to signal a user/post as a spam

- add the tests for the event published by the use cases
    - why I remove them : I was referencing the event bus instance directly in the tests and that makes the tests really
      coupled to the event bus, I when I decide that I have to change the event bus class, I found myself in a
      situation where I have to pass by all the tests in all the modules to change the eventbus used there, so I took
      the decision to delete the tests that were referencing the event bus, and add them later, but make sure to
      test them properly by mocking the domain event publisher interface in the use cases tests, and test the event
      publisher implementation on Its own in the infra layer and always mock the EventBus interface and NEVER reference
      the event bus directly


- my socket use cases:
    - user came online/go offline
    - message:
        - message read
        - message sent
        - user start/stop typing
    - receive notifications
