# COMP3012 - Term Assignment

## Introduction

In this assignment, you will demonstrate an ability to make a multi-page app, with no need to write front-end JavaScript. You will use Express.js, including a templating engine, to implement multiple routes across multiple resources, and you will use Passport.js to allow users to login.

## Preliminary Data Definitions:

### Users

- **USERS** correspond to people who can log in.
  - Users directly have this data:
    - id
    - uname
    - password
  - Users relate to this other data:
    - they may have created zero or more postings
    - they may have created zero or more comments
    - for a post, they may have voted it up, or down, or not at all
    - for a comment, they may have voted it up, or down, or not at all

### Subgroups

- **SUBGROUPS** are categories of the site. Every post belongs to one subgroup. If you've used something like reddit before, this will be a bit different. Unlike real reddit, subgroups are created dynamically, simply by saying a post belongs to one.
  - Subgroups directly have this data:
    - name
  - Subgroups relate to this other data:
    - subs always contain one or more postings

### Postings

- **POSTINGS** are the main content of the site. The purpose of a posting is a link, presumably to some external site. Postings also have some explanatory text, and a title. Postings can be voted up or voted down, and thus have a vote total.
  - Postings directly have this data:
    - id
    - title
    - link
    - description
    - creator
    - subgroup
    - timestamp
  - Postings relate to this other data:
    - they're by a user
    - they're in a sub
    - they have zero or more comments
    - they have a vote total

### Comments

- **_COMMENTS_**
  - Comments directly have this data:
    - id
    - description
    - creator
    - postid
    - timestamp
  - Comments relate to this other data:
    - they're by a user
    - they belong to a post

## Actual Requirements

Note: Below, if you see a ✅ emoji, it means I have already completed that task for you. (Note: There are some missing typescript types you might need to fill in)

✅ Users must be able to log in and log out.

Users must be able to create posts and comment on posts.

Posts are placed into subgroups, simply by specifying a subgroup during post-creation.

#### Routes Required

All GET routes, unless otherwise specified, should `res.render` a template. All POST routes, unless otherwise specified, should do their work and then `res.redirect`.

- authentication work
  - `GET /login` ✅
  - `POST /login` ✅
  - `POST /logout` ✅
- home
  - `GET /` (redirects to /posts or /login)
    - shows a listing of the most recent 20 posts ✅
      - each entry has a link, which uses the title for its visible text ✅
      - each entry also lists the user that created it
- subs

  - `GET /subs/list`
    - shows a list of all existing subs that have at least one post✅
      - each entry is a link to the appropriate `GET /subs/show/:subname`✅
      - sort them predictably somehow, either alphabetical or by-post-count or something, up to you✅
  - `GET /subs/show/:subname`
    - same as `GET /`, but filtered to only show posts that match the subname✅

- individual posts
  - `GET /posts/show/:postid`
    - shows post title, post link, timestamp, and creator ✅
    - also has a list of _all comments_ related to this post✅
      - each of these should show the comment description, creator, and timestamp✅
      - optionally, each comment could have a link to delete it✅
    - if you're logged in, a form for commenting should show✅
  - `GET /posts/create`
    - form for creating a new post✅
  - `POST /posts/create`
    - processes the creation✅
    - doesn't allow invalid creations, for example if there's no link and also no description✅
      - (no-link is okay if you want to do that, though)
    - every post must have a "sub", but it can be any string, including any string not previously used✅
      - so if the sub already exists, connect this post to that sub✅
      - but if the sub doesn't already exist, make a new sub!✅
    - when finished redirects to the post just created✅
  - `GET /posts/edit/:postid`
    - form for editing an existing post✅
    - please think for a moment about which parts of a post should be editable, and which should not✅
    - Shouldn't load unless you're logged in _as the correct user_✅
  - `POST /posts/edit/:postid`
    - redirect back to the post when done✅
  - `GET /posts/deleteconfirm/:postid`
    - form for confirming delete of an existing post✅
    - shouldn't load unless you're logged in _as the correct user_✅
  - `POST /posts/delete/:postid`
    - if cancelled, redirect back to the post✅
    - if successful, redirect back to the _sub that the post belonged to_✅
  - `POST /posts/comment-create/:postid`
    - remember how `GET /posts/show/:postid` has a form for comments? It submits to here.✅

#### Voting

Everywhere it's possible to see a post (homepage, subgroup listing, individual post page, etc), there should be an upvote button and a downvote button beside the post link. I suggest using two buttons, one that says "+" or "Up", and one that says "-" or "Down". This voting functionality should only show if the user is logged in.

Each button could be its own form, or they could both be in one form. Whichever seems easier for you.

Everywhere that it's possible to see a post, the net vote total should be visible (positive votes minus negative votes)

Unlike reddit, clicking on a vote link will do a full-page refresh. That's fine.

This is one area where CSS is necessary. If I have voted on a post (up or down), the button should be obviously active. Make the whole thing filled in or something.

If I click the already-voted on button, that should cancel my vote. So I should be able to upvote something, then change my mind and switch that to downvote by clickong on downvote, and then change my mind again and cancel my vote by clicking on the upvote.

So you'll need to add at least this route:

- `POST /posts/vote/:postid/`✅
  - uses a body field `setvoteto` to set vote to +1, -1, or 0, overriding previous vote✅
  - redirects back to `GET /posts/show/:postid`✅
"# comp3012-term-project" 
