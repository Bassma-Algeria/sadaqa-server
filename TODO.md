- add e2e test to the admin end points (validate the Authorization)

- when getting the posts list, take into account the enabling status, the rules are:
    - when there nothing that specify either we get the disabled posts, or not, then only return the enabled ones
    - when the requester specify that he want also the disabled, then we return everything

- add the user statistics,

- add the ability to return posts per publisherId

- stay consistence in your namings, no need for plural when returning the list of a specific post, (donation: [THE LIST]
  , and not donations: [THE LIST])

- always start from e2e test, then go into the acceptance tests

- change the search of the posts to full text search