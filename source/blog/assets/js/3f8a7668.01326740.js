"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[1764],{8945:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>c,default:()=>d,frontMatter:()=>o,metadata:()=>n,toc:()=>l});var n=s(9713),r=s(4848),i=s(8453);const o={title:"Using embedded resources in testing projects",tags:["UNIT-TESTING","INTEGRATION-TESTS","RESOURCES"],slug:"embedded-resources-testing-projects"},c="Using embedded resources in testing projects",a={authorsImageUrls:[]},l=[];function u(e){const t={a:"a",code:"code",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{src:s(3052).A+"",width:"1280",height:"720"})}),"\n",(0,r.jsx)(t.p,{children:"Quite often when you are writing tests it's necessary to store some data together with the testing project to make them available in the test functions."}),"\n",(0,r.jsx)(t.p,{children:"The solution is quite simple:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:["You put necessary files to some folder of your testing project (e.g. ",(0,r.jsx)(t.code,{children:"Resources"}),")"]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:'Mark them as "Embedded Resource"'}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsx)(t.p,{children:"After that, you can access any of these resources in any place of your testing module."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Here is an example of a resource file included in your testing project:\n",(0,r.jsx)(t.img,{src:"https://korzh.com/static/blogs/net-tricks/vs-project-embres.png",alt:"an embedded resource file"})]}),"\n",(0,r.jsx)(t.p,{children:"Here is a static class with extension functions which may help you on step #3:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'public static class ResourceUtils\n{\n\tpublic static Stream GetResourceStream(this Assembly assembly, string resourceFolder, string resourceFileName) \n\t{\n\t\t \n\t\tstring[] nameParts = assembly.FullName.Split(\',\');\n\t\t\t\n\t\tstring resourceName = nameParts[0] + "." +  resourceFolder + "." + resourceFileName;\n\n\t\tvar resources = new List<string>(assembly.GetManifestResourceNames());\n\t\tif (resources.Contains(resourceName))\n\t\t\treturn assembly.GetManifestResourceStream(resourceName);\n\t\telse\n\t\t\treturn null;\n\t}\n\n\tpublic static string GetResourceAsString(this Assembly assembly, string folder, string fileName) \n\t{\n\t\tstring fileContent;\n\t\tusing (StreamReader sr = new StreamReader(GetResourceStream(assembly, folder, fileName))) {\n\t\t\tfileContent = sr.ReadToEnd();\n\t\t}\n\t\treturn fileContent;\n\t}\n\t\n\tpublic static Stream GetResourceStream(this Type type, string resourceFolder, string resourceFileName) \n\t{\n\t\tvar assembly = type.GetTypeInfo().Assembly;\n\t\treturn assembly.GetResourceStream(resourceFolder, resourceFileName);\n\t}\n\t\n\tpublic static string GetResourceAsString(this Type type, string folder, string fileName) \n\t{\n\t\tvar assembly = type.GetTypeInfo().Assembly;\n\t\treturn assembly.GetResourceAsString(folder, fileName);\n\t}\t\n}\n\npublic class ResourceUtilsException : Exception {\n\tpublic ResourceUtilsException(string message) : base(message) { }\n}\n'})}),"\n",(0,r.jsxs)(t.p,{children:["To make it even simpler - we put these and some other functions to a ",(0,r.jsx)(t.a,{href:"https://www.nuget.org/packages/Korzh.Utils/",children:"Nuget package"})," you can reference in your project."]}),"\n",(0,r.jsx)(t.p,{children:"Finally, here is how your testing function will access the resource file defined on the first step:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'[TestMethod]\npublic void TestMethod1() {\n\tstring xml = typeof(UnitTest1).GetResourceAsString("Resources", "XMLFile1.xml");\n\t.    .    .    .    .    .\n}\n'})}),"\n",(0,r.jsxs)(t.p,{children:["(here, for the ",(0,r.jsx)(t.code,{children:"typeof"})," function parameter you use any class from the same assembly where your resources are placed)"]}),"\n",(0,r.jsx)(t.p,{children:"Enjoy!"})]})}function d(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},3052:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/cubes-677092_1280-cfd88cd19b62c7324e7ea2ace80b11f3.png"},8453:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>c});var n=s(6540);const r={},i=n.createContext(r);function o(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(i.Provider,{value:t},e.children)}},9713:e=>{e.exports=JSON.parse('{"permalink":"/blog/embedded-resources-testing-projects","source":"@site/blog/2018-05-30-embedded-resources-testing-projects/index.md","title":"Using embedded resources in testing projects","description":"Quite often when you are writing tests it\'s necessary to store some data together with the testing project to make them available in the test functions.","date":"2018-05-30T00:00:00.000Z","tags":[{"inline":true,"label":"UNIT-TESTING","permalink":"/blog/tags/unit-testing"},{"inline":true,"label":"INTEGRATION-TESTS","permalink":"/blog/tags/integration-tests"},{"inline":true,"label":"RESOURCES","permalink":"/blog/tags/resources"}],"readingTime":1.55,"hasTruncateMarker":true,"authors":[],"frontMatter":{"title":"Using embedded resources in testing projects","tags":["UNIT-TESTING","INTEGRATION-TESTS","RESOURCES"],"slug":"embedded-resources-testing-projects"},"unlisted":false,"prevItem":{"title":"Add extra user claims in ASP.NET Core webapp","permalink":"/blog/add-extra-user-claims-aspnet-core-webapp"},"nextItem":{"title":"ASP.NET Identity - Adding master password","permalink":"/blog/aspnet-identity-master-password"}}')}}]);