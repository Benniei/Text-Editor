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
