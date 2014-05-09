#PicoCTF2014 Backend
### 1. How to run the backend application
#### Step 1 : Install Node.js, npm, mongodb.(I assume you know how to do it)
#### Step 2 : Install node modules:
      cd PicoCTF2014/
      sudo npm install
#### Step 3 : Run the application
      node app.js
      
### 2. In-game queries

*(note that xxx.xxx.xxx.xxx refers to host ip.)*
#### Get information : 
- Get team info : http://xxx.xxx.xxx.xxx:3000/team?tid=?
- Get problem info : http://xxx.xxx.xxx.xxx:3000/problem?pid=?
- Get achievement info : http://xxx.xxx.xxx.xxx:3000/achievement?aid=?

#### Update team information : 

using POST instead of GET, see *client.js* for instance.

- Problem solved : http://xxx.xxx.xxx.xxx:3000/problemsolved
- Achievement unlocked : http://xxx.xxx.xxx.xxx:3000/achievementunlocked
- Problem displayed : http://xxx.xxx.xxx.xxx:3000/problemdisplayed
- Achievement displayed : http://xxx.xxx.xxx.xxx:3000/achievementdisplayed

### 3. How to add/remove teams/problems/achievements:

#### Team :
- Add team : http://xxx.xxx.xxx.xxx:3000/newteam
- Remove team : http://xxx.xxx.xxx.xxx:3000/removeteam?tid=?
- Team list : http://xxx.xxx.xxx.xxx:3000/teamlist
- Clear team records : http://xxx.xxx.xxx.xxx:3000/clearrecords?tid=?

#### Problem :
- Add problem : http://xxx.xxx.xxx.xxx:3000/newproblem
- Remove problem : http://xxx.xxx.xxx.xxx:3000/removeproblem?pid=?
- Problem list : http://xxx.xxx.xxx.xxx:3000/problemlist

#### Achievement : 
- Add achievement : http://xxx.xxx.xxx.xxx:3000/newachievement
- Remove achievement : http://xxx.xxx.xxx.xxx:3000/removeachievement?aid=?
- Achievement list : http://xxx.xxx.xxx.xxx:3000/achievementlist

*(note that it's NOT a auto-incrementing field for problem id/team id/achievement id, The reason is that I think you might not want the ids to be sequential and somehow use it as a unique username. So you might have to specify the id and dublicate ids are not allowed.)*

