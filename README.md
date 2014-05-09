How to run the backend application:
  Step 1 : Install Node.js, npm, mongodb.(I assume you know how to do it)
  Step 2 : Install node modules:
      cd PicoCTF2014/
      sudo npm install
  Step 3 : Run the application
      node app.js
      
How to add new teams/problems/achievements:
  Add new problem : http://xxx.xxx.xxx.xxx:3000/newproblem
  Add new team : http://xxx.xxx.xxx.xxx:3000/newproblem
  Add new achievement : http://xxx.xxx.xxx.xxx:3000/newachievement
  (note that it's NOT a auto-incrementing field for problem id/team id/achievement id, The reason is that I think you might not want the ids to be sequential and somehow use as a unique username. So you might have to specify the id and dublicate ids are not allowed.)
    
