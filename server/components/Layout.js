module.exports = function Layout({ children }) {
  return (
    <>
      {"<!DOCTYPE html>"}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Secret Santa</title>
          <script
            src="https://unpkg.com/htmx.org@1.9.9"
            integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX"
            crossorigin="anonymous"
          ></script>
          <script src="https://unpkg.com/htmx.org/dist/ext/sse.js"></script>
          <link
            href="https://fonts.googleapis.com/css?family=Bad+Script|Montserrat&display=swap&subset=cyrillic"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <div id="content">{children}</div>
        </body>
      </html>
    </>
  );
};
