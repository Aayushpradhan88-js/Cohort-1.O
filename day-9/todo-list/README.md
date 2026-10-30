# Daylist

Daylist is a small HTML, CSS, and JavaScript todo app with a Node.js server for
local task storage.

## Run it

From this directory, start the server with:

```powershell
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app
uses the Satoshi font from Fontshare when an internet connection is available.

## Task storage

Tasks are stored in `tasks.txt` as newline-delimited JSON events. Creating,
editing, and deleting tasks appends an event to the file; existing records are
not overwritten. The current task list is rebuilt from those events when the
app loads.
