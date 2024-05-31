import{r as f,g as M,h as V,i as q,R as w,j as e,ac as $,e as B,ad as c,E as H,X as W,ae as A,P as X,N as z,W as J,b as g,$ as n,L as K,m as S,af as y,ag as m,ah as F,f as v,O as I,ai as h,aj as k,y as T,p as D}from"./index-BMnTsVIf.js";function b(){return b=Object.assign?Object.assign.bind():function(r){for(var o=1;o<arguments.length;o++){var d=arguments[o];for(var u in d)Object.prototype.hasOwnProperty.call(d,u)&&(r[u]=d[u])}return r},b.apply(this,arguments)}const G=f.forwardRef((r,o)=>{const{className:d,id:u,style:j,children:E,raised:p,raisedIos:N,raisedMd:R,round:s,roundIos:a,roundMd:t,strong:l,strongIos:i,strongMd:x,tag:_="div"}=r,L=M(r),C=f.useRef(null);f.useImperativeHandle(o,()=>({el:C.current}));const O=V(d,{segmented:!0,"segmented-raised":p,"segmented-raised-ios":N,"segmented-raised-md":R,"segmented-round":s,"segmented-round-ios":a,"segmented-round-md":t,"segmented-strong":l,"segmented-strong-ios":i,"segmented-strong-md":x},q(r)),U=_;return w.createElement(U,b({id:u,style:j,className:O,ref:C},L),E,(l||i||x)&&w.createElement("span",{className:"segmented-highlight"}))});G.displayName="f7-segmented";const Q=G,Y=({tips:r="暂无数据",...o})=>e.jsx("div",{className:"h-full text-gray-400 flex justify-center items-center",...o,children:r}),P=$(B)||"",ss=()=>{const[r,o]=f.useState(c.FRIEND),d=H(),u=f.useMemo(()=>r===c.FRIEND?d.friendApply:d.groupApply,[r,d.friendApply,d.groupApply]);W(async()=>{await A()},()=>{},[r]);const j=async(s,a=0)=>{try{v.dialog.preloader(n("处理中..."));const t=a===y.ACCEPT;let l="";t&&(l="test");const{code:i,msg:x}=r===c.FRIEND?await I.manageFriendApplyApi({request_id:s.id,action:a,e2e_public_key:l}):(s==null?void 0:s.status)===h.INVITE_RECEIVER?await k.manageGroupRequestApi({group_id:s.group_id,action:a,id:s.id}):await k.manageGroupRequestAdminApi({group_id:s.group_id,action:a,id:s.id});if(i!==200){v.dialog.alert(n(x));return}await T.update(T.tables.apply_list,"id",s.id,{...s,status:t?h.ACCEPT:h.REFUSE}),await A()}catch(t){console.error("处理好友请求失败",t),v.dialog.alert(n("处理好友请求失败"))}finally{v.dialog.close()}},E=s=>({0:"待验证",1:"已通过",2:"已拒绝",3:"待验证",4:"邀请接收者"})[s],p=({status:s,sender_id:a})=>r===c.FRIEND?s===h.PENDING&&a!==P:s===h.PENDING||s===h.INVITE_RECEIVER,N=({status:s,sender_info:a})=>r===c.FRIEND?a.user_id===P:s===h.INVITE_SENDER,R=async s=>{try{const a=r===c.FRIEND,t=s.id,{code:l,msg:i}=a?await I.deleteFriendApplyApi({id:t}):await I.deleteGroupApplyApi({id:t});if(D(l===200?"删除成功":i),l!==200)return;await A()}catch(a){console.log(a),D("删除失败")}};return e.jsxs(X,{noToolbar:!0,className:"bg-bgTertiary",children:[e.jsx(z,{backLink:!0,className:"coss_applylist_navbar bg-bgPrimary hidden-navbar-bg",children:e.jsx(J,{children:e.jsxs(Q,{strong:!0,children:[e.jsx(g,{active:r===c.FRIEND,onClick:()=>o(c.FRIEND),children:n("好友申请")}),e.jsx(g,{active:r===c.GROUP,onClick:()=>o(c.GROUP),children:n("群聊申请")})]})})}),u.length<=0?e.jsx(Y,{}):e.jsx(K,{strongIos:!0,className:"m-0",mediaList:!0,children:u.map((s,a)=>{var t,l,i,x,_;return r===c.FRIEND?e.jsxs(S,{text:n((s==null?void 0:s.remark)||"对方没有留言"),swipeout:!p(s),children:[e.jsx("div",{slot:"media",className:"w-12 h-12",children:e.jsx("img",{src:(t=s==null?void 0:s.receiver_info)==null?void 0:t.user_avatar,className:"w-full h-full object-cover rounded-full bg-black bg-opacity-10"})}),e.jsx("div",{slot:"title",children:e.jsx("span",{children:n((l=s==null?void 0:s.receiver_info)==null?void 0:l.user_name)})}),e.jsx("div",{slot:"content",className:"pr-2 flex",children:p(s)?e.jsxs(e.Fragment,{children:[e.jsx(g,{className:"text-sm text-red-500",onClick:()=>j(s,y.REFUSE),children:"拒绝"}),e.jsx(g,{className:"text-sm text-primary",onClick:()=>j(s,y.ACCEPT),children:"同意"})]}):e.jsx(g,{className:"text-sm text-gray-500",onClick:()=>{},children:E(s.status)})}),!p(s)&&e.jsx(m,{right:!0,children:e.jsx(F,{close:!0,color:"red",onClick:()=>R(s),children:n("删除")})})]},a):e.jsxs(S,{text:n((s==null?void 0:s.remark)||"对方没有留言"),swipeout:!p(s),children:[e.jsx("div",{slot:"media",className:"w-12 h-12",children:e.jsx("img",{src:(i=s==null?void 0:s.receiver_info)==null?void 0:i.user_avatar,className:"w-full h-full object-cover rounded-full bg-black bg-opacity-10"})}),e.jsxs("div",{slot:"title",children:[e.jsx("span",{children:n(N(s)?"你":(x=s==null?void 0:s.sender_info)==null?void 0:x.user_name)}),e.jsx("span",{children:n("邀请")}),e.jsx("span",{children:n(N(s)?(_=s==null?void 0:s.receiver_info)==null?void 0:_.user_name:"你")}),e.jsx("span",{children:n("加入")}),e.jsx("span",{children:n(s==null?void 0:s.group_name)})]}),e.jsx("div",{slot:"content",className:"pr-2 flex",children:p(s)?e.jsxs(e.Fragment,{children:[e.jsx(g,{className:"text-sm text-red-500",onClick:()=>j(s,y.REFUSE),children:"拒绝"}),e.jsx(g,{className:"text-sm text-primary",onClick:()=>j(s,y.ACCEPT),children:"同意"})]}):e.jsx(g,{className:"text-sm text-gray-500",onClick:()=>{},children:E(s.status)})}),!p(s)&&e.jsx(m,{right:!0,children:e.jsx(F,{close:!0,color:"red",onClick:()=>R(s),children:n("删除")})})]},a)})})]})};export{ss as default};