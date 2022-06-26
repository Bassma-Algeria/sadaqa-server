# **Database design**

- [click here](https://dbdiagram.io/d/60fdb24428da596eb54c79e1)

# **The api end points**

### 1. Users end points

- `/api/users/login` post request to login the user
- `/api/users/signup` post request to create a new user
- `/api/users/getUser/:userId` get request to get the target user info
- `/api/users/getAllAssoctiations` get request to get all the registered associations
- `/api/users/getAssociationPerWilaya` get request to get all the registered associations in the wialya passed using the query string
- `/api/users/editGeneralInfo` put request to edit the auth user info
- `/api/users/editCredentialsInfo` put request to edit the auth user credentials (email, password)
- `/api/users/setPreferences` put request to set the auth user preferences (send theme in the query string) and make sure the name is the same as the columns name is the DB
- `/api/users/getUsersIds` get request to get all the users ids

### 2. Posts end points

- `/api/posts` get request to return a number given of posts filtred by the query string that we pass to it, the query string are: wilaya - adType - category - userId - active, also add: numOfPage - numOfAdsPerPage to specify the number of posts to return
- `/api/posts/numOfPosts` same as the previous just return the number of filtred posts and not the posts info (note that numOfPage - numOfAdsPerPage are not valid here)
- `/api/posts/createPost` post request to create a new post
- `/api/posts/getPost/:postId` get request to return the target post
- `/api/posts/search/:searchPhrase` get request to get the posts that match search phrase
- `/api/posts/likePost/:postId` put request to add a like to the given post
- `/api/posts/sharePost/:postId` put request to add a share to the given post
- `/api/posts/makeInactive/:postId` put request to make the given post inactive
- `/api/posts/deletePost/:postId` delete request to delete the given post
- `/api/posts/getPostsIds` get request to get all the posts ids

### 3. Messages end points

- `/api/messages/sendMessage` post request to send a message
- `/api/messages/getContacts` get request to get the contacts of the auth user
- `/api/messages/getConversation/:chatParticipantId` get request to get the conversation between the auth user and the given user
- `/api/messages/makeMessagesRead/:chatParticipantId` put request to make the messages with the chatParticipant read

### 4. Notifications end points

- `/api/notifications/getAuthUserNotifications` get request to get the notification of the auth user, should pass numOfGroupe & numOfElementsPerGroupe as query strings
- `/api/notifications/makeNotificationsRead` put request to make the post notifications of the auth user read

### 5. visits end points

- `/api/visits/addVisit` post request to register the new visits with the userId and the device type
