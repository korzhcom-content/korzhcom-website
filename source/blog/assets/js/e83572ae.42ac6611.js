"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[1557],{2051:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>r,toc:()=>h});var r=t(6092),n=t(4848),a=t(8453);const i={title:"ASP.NET Identity - Migrating users' passwords from ASP.NET Membership",tags:["ASP-NET-CORE","ASP-NET-IDENTITY","ASP-NET_MEMBERSHIP"],slug:"aspnet-identity-migrate-membership-passwords"},o="ASP.NET Identity: Migrating users' passwords from ASP.NET Membership",d={authorsImageUrls:[]},h=[{value:"Problem",id:"problem",level:2},{value:"Solution",id:"solution",level:2}];function l(e){const s={a:"a",code:"code",h2:"h2",img:"img",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{src:t(9322).A+"",width:"1280",height:"604"})}),"\n",(0,n.jsxs)(s.p,{children:["This is a third part of the series of articles about some not-so-well-known features and tricks in ASP.NET Identity.\nHere are you can find the ",(0,n.jsx)(s.a,{href:"/blog/add-extra-user-claims-aspnet-core-webapp",children:"first"})," and the ",(0,n.jsx)(s.a,{href:"/blog/aspnet-identity-weakening-password-policies",children:"second"})," parts."]}),"\n",(0,n.jsx)(s.h2,{id:"problem",children:"Problem"}),"\n",(0,n.jsx)(s.p,{children:"This task usually appears when you need to transfer your old MVC web application to ASP.NET Core. If you use MVC version 3 or 4 and your application provides a user authentication service, then most likely this part is done with the old ASP.NET Membership library."}),"\n",(0,n.jsx)(s.p,{children:"So, imagine you have a bunch of users, each of them has some password and the hash of that password stored in some database. Now you need to transfer all your current users to the new system built with ASP.NET Core.\nOf course, it's not a big problem to transfer their names, addresses, and other information. The problem is in those password hashes. ASP.NET Core Identity uses another hashing algorithm so all current users will not be able to access the system with their old passwords - the hashes will not match."}),"\n",(0,n.jsx)(s.h2,{id:"solution",children:"Solution"}),"\n",(0,n.jsx)(s.p,{children:'The solution is rather simple: we need to rewrite the default hashing service in ASP.NET Core Identity and make it "understand" both the old and new hashes.'}),"\n",(0,n.jsx)(s.p,{children:"Here is our class which implements IPassowrdHasher interface:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-c#",children:'public class PasswordHasherWithOldMembershipSupport : IPasswordHasher<ApplicationUser>\n{\n\t//an instance of the default password hasher\n\tIPasswordHasher<ApplicationUser> _identityPasswordHasher = new PasswordHasher<ApplicationUser>();\n\n\t//Hashes the password using old algorithm from the days of ASP.NET Membership\n\tinternal static string HashPasswordInOldFormat(string password) \n\t{\n\t\tvar sha1 = new SHA1CryptoServiceProvider();\n\t\tvar data = Encoding.ASCII.GetBytes(password);\n\t\tvar sha1data = sha1.ComputeHash(data);\n\t\treturn Convert.ToBase64String(sha1data);\n\t}\n\n\t//the passwords of the new users will be hashed with new algorithm\n\tpublic string HashPassword(ApplicationUser user, string password) {\n\t\treturn _identityPasswordHasher.HashPassword(user, password);\n\t}\n\n\tpublic PasswordVerificationResult VerifyHashedPassword(ApplicationUser user, \n\t\t\t\tstring hashedPassword, string providedPassword) \n\t{\n\t\tstring pwdHash2 = HashPasswordInOldFormat(providedPassword);\n\t\t\n\n\t\tif (hashedPassword == pwdHash2) {\n\t\t\t//first we check the hashed password with "old" hash\n\t\t\treturn PasswordVerificationResult.Success;\n\t\t}\n\t\telse {\n\t\t\t//if old hash doesn\'t work - use the default approach \n\t\t\treturn _identityPasswordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);\n\t\t}\n\t}\n}\n'})}),"\n",(0,n.jsxs)(s.p,{children:["After that we just need to register our new ",(0,n.jsx)(s.code,{children:"IPasswordHasher"})," implementation in the DI container:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{children:"//Startup.cs\n.   .   .   .   .   .\npublic void ConfigureServices(IServiceCollection services)\n{\n    .   .   .   .   .   .\n \n    services.AddSingleton<IPasswordHasher<ApplicationUser>, PasswordHasherWithOldMembershipSupport>();\n}\n"})})]})}function p(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},9322:(e,s,t)=>{t.d(s,{A:()=>r});const r=t.p+"assets/images/user-data-migrate-d8d3fd31b40233917963a9ff2a354ed9.png"},8453:(e,s,t)=>{t.d(s,{R:()=>i,x:()=>o});var r=t(6540);const n={},a=r.createContext(n);function i(e){const s=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),r.createElement(a.Provider,{value:s},e.children)}},6092:e=>{e.exports=JSON.parse('{"permalink":"/blog/aspnet-identity-migrate-membership-passwords","source":"@site/blog/2018-02-22-aspnet-identity-migrate-membership-passwords/index.md","title":"ASP.NET Identity - Migrating users\' passwords from ASP.NET Membership","description":"This is a third part of the series of articles about some not-so-well-known features and tricks in ASP.NET Identity.","date":"2018-02-22T00:00:00.000Z","tags":[{"inline":true,"label":"ASP-NET-CORE","permalink":"/blog/tags/asp-net-core"},{"inline":true,"label":"ASP-NET-IDENTITY","permalink":"/blog/tags/asp-net-identity"},{"inline":true,"label":"ASP-NET_MEMBERSHIP","permalink":"/blog/tags/asp-net-membership"}],"readingTime":1.86,"hasTruncateMarker":true,"authors":[],"frontMatter":{"title":"ASP.NET Identity - Migrating users\' passwords from ASP.NET Membership","tags":["ASP-NET-CORE","ASP-NET-IDENTITY","ASP-NET_MEMBERSHIP"],"slug":"aspnet-identity-migrate-membership-passwords"},"unlisted":false,"prevItem":{"title":"ASP.NET Identity - Adding master password","permalink":"/blog/aspnet-identity-master-password"},"nextItem":{"title":"ASP.NET Identity - Weakening password policies","permalink":"/blog/aspnet-identity-weakening-password-policies"}}')}}]);