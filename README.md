# the Fight for the Future / Center for Rights campaign boilerplate

**CAMPAIGN AND WRITING PEOPLE READ HERE PLEASE**

- Generally, content is written in Markdown format. You can find documentation
for this wonderful plain text formatting syntax all over:
    - [daringfireball][07], the source of markdown
    - [github][08]'s docs are super easy to follow
    - [kramdown][09] documents some extra features we have available to us
- Any content that is blog-post-like in nature can be found in `app/_posts`.
- Blog posts should follow the naming convention `YYYY-MM-DD-post-title.md`
- If the footer requires additional copy, you can add it in `app/_includes/footer-extra-copy.md`
- If there’s text you need to update, but can't find, it might be hiding in `app/_layouts/default.html` or `app/index.html`.
- If you are unclear on updating the html, ask a dev—we’re happy to help!

## For developers:

In the interest of avoiding unnecessarily oppressive language, please create/set default `production` instead of `master` branch.

Fight for the Future campaigns are compiled by [Jekyll][03], built using [Grunt.js][04], deployed using [Travis-CI][02], and hosted by [GitHub pages][06].

### Update meta info

Before you get going, you’ll need the following information: project name (_usually_ the github repo), campaign title, campaign description, an unused port number.

- **Project name:**
  - [L2 of `package.json`][11]
  - [L19 of `Gruntfile.js`][12]
- **Repo:**
  - [L6 of `package.json`][15]
- **Campaign title:**
  - [L10 of `_config.yml`][10]
- **Campaign description:**
  - [L5 of `package.json`][13]
  - [L11 of `_config.yml`][14]
- **Port:**
  - [L20 of `Gruntfile.js`][16]

### Installing & running the server

- Install/switch to Ruby 2.3.1 (i recommend [rbenv][01])
- `cp .env.example .env`
- `npm install` to install packages,
- `npm start` to run grunt (compiles assets, then watches for changes and compiles those too.)
- A browser window will open pointed to the local server! 🎉

### Setting up Free Progress for social A/B testing

Free Progress employs a domain security token mechanism to whitelist new domains automatically. This can be built into the deploy process for campaign sites. The build task stored in `scripts/generate_fp_token.js` creates a file called `public/freeprogress.txt` which is a SHA256 hash of the Free Progress domain security token concatenated with the site's CNAME. In order for this to work, please do the following:

- Edit the `FP_DOMAIN_SECURITY_TOKEN` export in `.env` to the correct value stored in the Free Progress environment.
- Also add `FP_DOMAIN_SECURITY_TOKEN` as a hidden environment variable in Travis.

### Deploying

In order to successfully trigger deploys, you must uncomment deploy instructions in `.travis.yml` and update `access_key_id` & `secret_access_key`. To encrypt `secret_access_key`, run `travis encrypt SECRET_ACCESS_KEY_HERE`.

This boilerplate is set up to make travis auto-deploys the easiest thing ever. To set them up, enable builds at https://travis-ci.org/$USERNAME/$REPO/settings/

#### Recommended setup:

General settings:

- [X] Build only if .travis.yml is present
- [X] Build pushes
- [X] Limit concurrent jobs (1)
- [X] Build pull requests

Environment variables:

- GH_REF: `github.com/$USERNAME/$REPO`
- GH_TOKEN: you can generate this at <https://github.com/settings/tokens>—make sure "Display value in build log" is set to **OFF**.

Travis will build on pull requests to make sure they don't break, but only actually deploy when PRs are merged to production. So always open pull requests.

### Code Structure

#### CSS/Less

```
less
├─ base
│  ├─ common.less
│  └─ variables.less
├─ components
│  ├─ animation.less
│  └─ typography.less
├─ core.less
├─ lib
│  └─ reset.less
└─ partials
   └─ footer.less
```

- All Less files are compiled & autoprefixed on build—minified as well on deploy
- css files are saved to `public/css/core.css` on local builds
- css files are saved to `assets/css/core.css` on deploy builds, then pushed to `project-name/css/core.css` on S3
- When in doubt, make a new Less file and import it in `core.less`—there’s no real performance hit as a result of good organization

#### Javascript

- All js files are concatenated on build—minified as well on deploy
- js files are saved to `public/js/core.js` on local builds
- js files are saved to `assets/js/core.js` on deploy builds, then pushed to `project-name/js/core.js` on S3
- When in doubt, make a new javascript file and add it to the javascript files array on [L27 of Gruntfile.js][17]—there’s no real performance hit as a result of good organization

### Implementing design

- [ ] TODO: design pattern library
- [ ] TODO: build pattern library
- [ ] TODO: launch pattern library
- [ ] TODO: link pattern library here

- Is this something that could be considered a stand-alone webapp? If so, check out `app/_includes/apple-touch-icons.html` & include in `<head>` of `app/_layouts/default.html`
- delete one of the footers from `app/_layouts/default.html` (fftf or fftfef). if there is additional text to be added to the footer, use the markdown file at `app/_includes/footer-extra-copy.md`

### Sample jekyll/liquid code

Cycle through markdown files in `_posts` directory

```liquid
{% for post in site.posts %}

# [{{ post.title }}](#{{ post.slug }})

<time datetime="{{ post.date | date_to_rfc822 }}"></time>

{{ post.content }}

{% endfor %}
```

[01]: https://github.com/sstephenson/rbenv
[02]: https://docs.travis-ci.com/
[03]: http://jekyllrb.com/docs/home/
[04]: http://gruntjs.com/getting-started
[05]: https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
[06]: https://help.github.com/categories/github-pages-basics/

[07]: http://daringfireball.net/projects/markdown/syntax
[08]: https://help.github.com/articles/markdown-basics/
[09]: http://kramdown.gettalong.org/syntax.html

[10]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/_config.yml#L10
[11]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/package.json#L2
[12]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/Gruntfile.js#L19
[13]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/package.json#L5
[14]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/_config.yml#L11
[15]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/package.json#L6
[16]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/Gruntfile.js#L20

[17]: https://github.com/fightforthefuture/fftf-campaign-boilerplate/blob/production/Gruntfile.js#L27
