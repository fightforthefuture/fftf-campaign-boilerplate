#!/bin/bash
cd dist || exit 0;
(git init
 git config user.name "Travis-CI"
 git config user.email "travis@example.org"
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)

# Move this to L6 once there's a CNAME file
# cp ../CNAME ./CNAME
