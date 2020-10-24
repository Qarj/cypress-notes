# Run challenge manually

Start Cypress
```
node_modules/.bin/cypress open
```

Click on `challenge_01.js`

# Run challenge headlessly

```
npx cypress run
```

# Run through Chrome

```
npx cypress run --browser chrome
```

# Stop tracking video file

```
git update-index --skip-worktree challenges/challenge_01/cypress/videos/challenge_01.js.mp4
```
