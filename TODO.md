- add e2e test to the admin end points (validate the Authorization)

- when getting the posts list, take into account the enabling status, the rules are:
    - when there nothing that specify either we get the disabled posts, or not, then only return the enabled ones
    - when the requester specify that he want also the disabled, then we return everything

- delete favourite post when the target post deleted

- move the ability to publish a post to the domain

- re-check the GetAccountsByWilayaNumberUseCase in UsersManager

- add the ability to share posts
- add the ability to signal a user/post as a spam

- email attachments not sent correctly
