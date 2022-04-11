# CSE 356 Text Editor

## Milestone 1

Project is to create a shared document service. Multiple clients/users should be able to edit and coordinate to work on documents.

1. /connect/:id

    Open a unique connection for the id, create a persistent document (if one does not exist), and start receiving an http event stream as a response The server will send ‘message’ events in the stream when any connected user modifies the document. Contents of the message events:

    * First message event should be emitted after the connection is established with format {data: {content: oplist}} where the ops here must represent the whole operation array for the whole document initially.
    * Subsequent message events should be emitted on changes to the document from users {data: array_of_oplists}
    * Ops is the array of rich-text type OT transformations (retain, insert, delete). The operations should support “bold” and “italics” attributes. For an example of an “ops”

2. /op/:id

    Type : POST

    Sample Payload :
    ```
    [
        [{'retain': 5}, {'insert': 'a'}],
        [{'retain': 4}, {'delete': 10}],
        [{'insert': “Hello”, 'attributes': {'bold': true}}]
    ]
    ```
3. /doc/:id

    Type : GET

    Sample Response :
    ```
    {'html': ‘Whole_document_contents_as_HTML’}
    ```
    HTML format:
    ```
    Enclose the doc contents in <p>...</p>
    Use 
     for line breaks
    Use <strong>...</strong> for bold
    Use <em>..</em> for italics
    ```

4. UI Requirements: 

    Serve the collaborative editor UI from the document root of the server.
    Have an integrated client code that is responsible for the following:

    a. Client should use /connect/id to open a connection and listen to the event stream for changes and update the UI accordingly.
    
    b. The client should POST its changes (while editing the doc from UI)  via /op/id to the server.

## Milestone 2

Milestone #2 high-level requirements:

Support creating new users
Existing users can log in to start a new cookie-based session
Logged in users can see a list of existing documents
Logged in users can create new documents
Logged in users can connect new editing sessions to existing documents
Logged in users can upload image files and insert images into the shared documents
Users editing a document should see the list of connected users and their cursors
The following API calls should be implemented by your server.  All API calls should return data as a JSON object.  In case of an error, a JSON object of the form { error: true, message: 'description here' } should be returned.  Each bullet below shows the JSON object parameters of the request and response.

* /users/login     { email, password }      { name }              When successful, response must include a session cookie.

* /users/logout    {}                                  {}                       Terminate the current user's session.

* /users/signup   { name, email, password }     {}              Create inactive user for given email address (this user can't log in).

* /users/verify?any=parameters&you=need&key=KEY   Activate user if provided KEY is correct (GET request).

* /collection/create    { name }          { docid }                   Create a new document.

* /collection/delete    { docid }          {}                              Delete an existing document.

* /collection/list     {}                [{ id, name }, ...]                 Return a list of the most-recently modified 10 documents sorted in reverse chronological order.

* /media/upload        (file)                { mediaid }               Save uploaded file and its mime type and return its ID.

* /media/access/MEDIAID                                                Return the contents of a previously uploaded media file (GET request).

* /doc/edit/DOCID     ...                  (html+js)                    Serve the editor UI for document with ID DOCID (GET request).

* /doc/connect/DOCID/UID     ...   (Delta event stream)   Start Delta event stream connection to server (GET request).

* /doc/op/DOCID/UID  { version, op }  { status }               Submit a new Delta op for document with given version.

* /doc/presence/DOCID/UID   { index, length }   {}           Submit a new cursor location index and selection length.

* /doc/get/DOCID/UID       ...          (html)                        Return the HTML of the current document.

* /home                              ...          (html+js)                    Return the HTML shown to logged in users, links to /doc/edit/DOCID for the most-recently modified 10 documents along with "delete" links for them, a form field to create new documents (via the /collection/create call), and a Logout button.

All API calls outside of /users/ must return an error if a valid session indicated by a cookie is not started.  The /users/logout call must terminate the user's current cookie session and any event streams connected for that cookie session.

A Delta op should be in the form [{ cmd }, {cmd}, ...] where cmd can be "retain" (integer), delete (integer), or insert (string or {image:URL}).  The intention for the image op is for users to upload png or jpeg files, receive a corresponding mediaid from the server, and use this mediaid to construct a URL using the /media/access/MEDIAID endpoint, which can then be inserted into the document.

When a Delta op is submitted via the /doc/op/DOCID/UID API call, it must include a version number of the client-side document for which the operation is being performed.  Each successfully submitted op increments the document version number.  The backend must respond with status 'ok' if the submission of the operation is successful or 'retry' if the server's document version does not match (is ahead of) the version for which the op was submitted.  In the case of a 'retry' response, the client is expected to keep retrying the op submission with updated version numbers until it succeeds.  Note that the client should never have more than a single outstanding (unacknowledged) request to the server at a time to enable OT to work properly.

The EventStream should send messages in the form { content, version }, { presence }, { ack }, or a Delta op.  The content is an array of Delta op objects sufficient to reconstruct the entire document.  The presence object is of the form { id, cursor } where cursor is of the form { index, length, name }, corresponding to the UID of the document session that sent the cursor, the cursor index, selection length, and name of the user of the corresponding document session.  The ack response is used by the backend to echo back the latest op submitted by the client (to enable the client to appropriately increment its document version number).

The /users/signup request must send an email to the user's email address which instructs the user to access a verification URL.  The body of the email must contain a complete verification URL.  The verification URL must be at the API path /users/verify and can contain any number of query string parameters in addition to a key parameter.  The key must be unique for the verification request and must be verified by the API request for the account to be enabled.  Optionally, the /users/verify call can start a login session and redirect the user to the It would also be nice to redirect the user to /home.

File uploads at the /media/upload endpoint must be either png or jpeg to be accepted.  The uploaded files must be stored on the server along with their mime type.  The /media/access/MEDIAID must respond with the correct mime type along with the image file contents.