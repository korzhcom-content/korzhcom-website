"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[4013],{748:(e,t,s)=>{s(7294),s(1048),s(5893)},3538:(e,t,s)=>{s.d(t,{Z:()=>p});var a=s(7294),i=s(4334),r=s(3530),l=s(3488),n=s(264),c=s(3699),o=s(6550),m=s(9003);function d(e){const{pathname:t}=(0,o.TH)();return(0,a.useMemo)((()=>e.filter((e=>function(e,t){return!(e.unlisted&&!(0,m.Mg)(e.permalink,t))}(e,t)))),[e,t])}var g=s(3086),u=s(5893);function b(e){let{sidebar:t}=e;const s=d(t.items);return(0,u.jsx)("ul",{className:"menu__list",children:s.map((e=>(0,u.jsx)("li",{className:"menu__list-item",children:(0,u.jsx)(c.Z,{isNavLink:!0,to:e.permalink,className:"menu__link",activeClassName:"menu__link--active",children:e.title})},e.permalink)))})}function h(e){return(0,u.jsx)(g.Zo,{component:b,props:e})}function j(e){let{sidebar:t}=e;const s=(0,l.i)();return t?.items.length?"mobile"===s?(0,u.jsx)(h,{sidebar:t}):(0,u.jsx)(n.Z,{sidebar:t}):null}function p(e){const{sidebar:t,toc:s,children:a,...l}=e,n=t&&t.items.length>0;return(0,u.jsx)(r.Z,{...l,children:(0,u.jsx)("div",{className:"container margin-vert--lg",children:(0,u.jsxs)("div",{className:"row",children:[(0,u.jsx)(j,{sidebar:t}),(0,u.jsx)("main",{className:(0,i.Z)("col",{"col--7":n,"col--9 col--offset-1":!n}),itemScope:!0,itemType:"https://schema.org/Blog",children:a}),s&&(0,u.jsx)("div",{className:"col col--2",children:s})]})})})}},2864:(e,t,s)=>{s.r(t),s.d(t,{default:()=>j});s(7294);var a=s(4334),i=s(7325);const r=()=>(0,i.I)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});var l=s(5463),n=s(3702),c=s(3538),o=s(3852),m=s(3899);const d={tag:"tag_Nnez"};var g=s(5893);function u(e){let{letterEntry:t}=e;return(0,g.jsxs)("article",{children:[(0,g.jsx)(m.Z,{as:"h2",id:t.letter,children:t.letter}),(0,g.jsx)("ul",{className:"padding--none",children:t.tags.map((e=>(0,g.jsx)("li",{className:d.tag,children:(0,g.jsx)(o.Z,{...e})},e.permalink)))}),(0,g.jsx)("hr",{})]})}function b(e){let{tags:t}=e;const s=function(e){const t={};return Object.values(e).forEach((e=>{const s=function(e){return e[0].toUpperCase()}(e.label);t[s]??=[],t[s].push(e)})),Object.entries(t).sort(((e,t)=>{let[s]=e,[a]=t;return s.localeCompare(a)})).map((e=>{let[t,s]=e;return{letter:t,tags:s.sort(((e,t)=>e.label.localeCompare(t.label)))}}))}(t);return(0,g.jsx)("section",{className:"margin-vert--lg",children:s.map((e=>(0,g.jsx)(u,{letterEntry:e},e.letter)))})}var h=s(3647);function j(e){let{tags:t,sidebar:s}=e;const i=r();return(0,g.jsxs)(l.FG,{className:(0,a.Z)(n.k.wrapper.blogPages,n.k.page.blogTagsListPage),children:[(0,g.jsx)(l.d,{title:i}),(0,g.jsx)(h.Z,{tag:"blog_tags_list"}),(0,g.jsxs)(c.Z,{sidebar:s,children:[(0,g.jsx)(m.Z,{as:"h1",children:i}),(0,g.jsx)(b,{tags:t})]})]})}},3852:(e,t,s)=>{s.d(t,{Z:()=>n});s(7294);var a=s(4334),i=s(3699);const r={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var l=s(5893);function n(e){let{permalink:t,label:s,count:n}=e;return(0,l.jsxs)(i.Z,{href:t,className:(0,a.Z)(r.tag,n?r.tagWithCount:r.tagRegular),children:[s,n&&(0,l.jsx)("span",{children:n})]})}},264:(e,t,s)=>{s.d(t,{Z:()=>c});s(7294);var a=s(512),i=s(3699),r=s(7325);const l={sidebar:"sidebar_brwN",sidebarItemTitle:"sidebarItemTitle_r4Q1",sidebarItemList:"sidebarItemList_QwSx",sidebarItem:"sidebarItem_lnhn",sidebarItemLink:"sidebarItemLink_yNGZ",sidebarItemLinkActive:"sidebarItemLinkActive_oSRm"};s(748);var n=s(5893);function c(e){let{sidebar:t}=e;return(0,n.jsx)("aside",{className:"col col--3",children:(0,n.jsxs)("nav",{className:(0,a.Z)(l.sidebar,"thin-scrollbar"),"aria-label":(0,r.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"}),children:[(0,n.jsx)("div",{className:(0,a.Z)(l.sidebarItemTitle,"margin-bottom--md"),children:t.title}),(0,n.jsx)("ul",{className:(0,a.Z)(l.sidebarItemList,"clean-list"),children:t.items.map((e=>(0,n.jsx)("li",{className:l.sidebarItem,children:(0,n.jsx)(i.Z,{isNavLink:!0,to:e.permalink,className:l.sidebarItemLink,activeClassName:l.sidebarItemLinkActive,children:e.title})},e.permalink)))})]})})}}}]);