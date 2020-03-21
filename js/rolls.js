"use strict";function _objectWithoutProperties(a,b){if(null==a)return{};var c,d,e=_objectWithoutPropertiesLoose(a,b);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(a);for(d=0;d<f.length;d++)c=f[d],!(0<=b.indexOf(c))&&Object.prototype.propertyIsEnumerable.call(a,c)&&(e[c]=a[c])}return e}function _objectWithoutPropertiesLoose(a,b){if(null==a)return{};var c,d,e={},f=Object.keys(a);for(d=0;d<f.length;d++)c=f[d],0<=b.indexOf(c)||(e[c]=a[c]);return e}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _get(a,b,c){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(a,b,c){var d=_superPropBase(a,b);if(d){var e=Object.getOwnPropertyDescriptor(d,b);return e.get?e.get.call(c):e.value}},_get(a,b,c||a)}function _superPropBase(a,b){for(;!Object.prototype.hasOwnProperty.call(a,b)&&(a=_getPrototypeOf(a),null!==a););return a}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function ensureList(a){return a&&a.length?a:[a]}function sample(a){return a[Math.floor(Math.random()*a.length)]}var Roll=function(){function a(b){var c=b.stepIndex,d=b.actionIndex,e=b.resultIndex,f=b.team,g=b.teamId,h=b.turn,i=b.playerName,j=b.playerTeam,k=b.playerTeamId,l=b.rollType,m=b.dice;_classCallCheck(this,a),this.stepIndex=c,this.actionIndex=d,this.resultIndex=e,this.activeTeam=f,this.activeTeamId=g,this.turn=h,this.playerName=i,this.playerTeam=j,this.playerTeamId=k,this.rollType=l,this.dice=m}return _createClass(a,[{key:"value",value:function value(){throw"Must be defined by subclass"}},{key:"simulateDice",value:function simulateDice(){throw"Must be defined by subclass"}},{key:"simulated",value:function simulated(a){return this.dataPoint(a,this.simulateDice(),"simulated")}},{key:"dataPoint",value:function dataPoint(a,b,c){return this.playerTeam||this.activTeam||console.log(this),{iteration:a,index:this.stepIndex.toString().padStart(3,"0")+"."+this.actionIndex+"."+this.resultIndex,team:this.playerTeam||this.activeTeam,teamId:this.playerTeamId||this.activeTeamId,turn:this.turn,player:this.playerName,playerTeam:this.playerTeam,rollName:this.rollName||this.rollType,outcomeValue:this.value(b),expectedValue:this.expectedValue,type:c,dice:b}}},{key:"expectedValue",get:function get(){throw"Must be defined by subclass"}},{key:"actual",get:function get(){return this.dataPoint(0,this.dice,"actual")}}],[{key:"argsFromXML",value:function argsFromXML(a,b,c,d,e,f){return{stepIndex:a,actionIndex:c,resultIndex:e,team:this.activeTeamName(b),teamId:this.activeTeamId(b),turn:this.currentTurn(b),playerName:this.currentPlayerName(b,d),playerTeam:this.currentPlayerTeam(b,d),playerTeamId:this.currentPlayerTeamId(b,d),rollType:this.rollType(f),dice:this.dice(f)}}},{key:"ignore",value:function ignore(){return!1}},{key:"dice",value:function dice(a){return this.translateStringNumberList(a.coachchoices.listdices)}},{key:"teamName",value:function teamName(a,b){return a.boardstate.listteams.teamstate[b].data.name}},{key:"activeTeamName",value:function activeTeamName(a){return this.teamName(a,this.activeTeamId(a))}},{key:"activeTeamId",value:function activeTeamId(a){return a.boardstate.activeteam||0}},{key:"currentTurn",value:function currentTurn(a){return a.boardstate.listteams.teamstate[this.activeTeamId(a)].gameturn||0}},{key:"currentPlayerName",value:function currentPlayerName(a,b){var c=this.currentPlayer(b),d=!0,e=!1,f=void 0;try{for(var g,h=a.boardstate.listteams.teamstate[Symbol.iterator]();!(d=(g=h.next()).done);d=!0){var i=g.value,j=!0,k=!1,l=void 0;try{for(var m,n,o=i.listpitchplayers.playerstate[Symbol.iterator]();!(j=(m=o.next()).done);j=!0)if(n=m.value,n.id===c)return n.data.name}catch(a){k=!0,l=a}finally{try{j||null==o["return"]||o["return"]()}finally{if(k)throw l}}}}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}console.log("No player found",{replaystep:a,action:b})}},{key:"currentPlayerTeam",value:function currentPlayerTeam(b,c){var d=a.currentPlayer(c),e=!0,f=!1,g=void 0;try{for(var h,i=b.boardstate.listteams.teamstate[Symbol.iterator]();!(e=(h=i.next()).done);e=!0){var j=h.value,k=!0,l=!1,m=void 0;try{for(var n,o,p=j.listpitchplayers.playerstate[Symbol.iterator]();!(k=(n=p.next()).done);k=!0)if(o=n.value,o.id===d)return j.data.name}catch(a){l=!0,m=a}finally{try{k||null==p["return"]||p["return"]()}finally{if(l)throw m}}}}catch(a){f=!0,g=a}finally{try{e||null==i["return"]||i["return"]()}finally{if(f)throw g}}}},{key:"currentPlayerTeamId",value:function currentPlayerTeamId(b,c){for(var d=a.currentPlayer(c),e=b.boardstate.listteams.teamstate,f=0;f<e.length;f++){var g=e[f],h=!0,i=!1,j=void 0;try{for(var k,l,m=g.listpitchplayers.playerstate[Symbol.iterator]();!(h=(k=m.next()).done);h=!0)if(l=k.value,l.id===d)return f}catch(a){i=!0,j=a}finally{try{h||null==m["return"]||m["return"]()}finally{if(i)throw j}}}}},{key:"currentPlayer",value:function currentPlayer(a){return a.playerid}},{key:"rollType",value:function rollType(a){return a.rolltype}},{key:"translateStringNumberList",value:function translateStringNumberList(a){if(!a)return[];for(var b=a.substring(1,a.length-1),c=b.split(","),d=[],e=0;e<c.length;e++)d.push(parseInt(c[e]));return d}},{key:"fromReplayStep",value:function fromReplayStep(b,c){var d=c.ruleseventboardaction;if(d&&d.length){for(var e,f=[],g=0;g<d.length;g++)e=d[g],f=f.concat(a.fromAction(b,c,g,e));return f}return d?a.fromAction(b,c,0,d):[]}},{key:"fromAction",value:function fromAction(a,b,c,d){var e=d.results.boardactionresult;if(e&&e.length){for(var f=[],g=0;g<e.length;g++){var h=e[g],i=this.fromBoardActionResult(a,b,c,d,g,h);i&&f.push(i)}return f}if(e){var i=this.fromBoardActionResult(a,b,c,d,0,e);return i?[i]:[]}console.warning("Unexpectedly missing boardactionresult",{stepIndex:a,replaystep:b,action:d})}},{key:"fromBoardActionResult",value:function fromBoardActionResult(a,b,c,d,e,f){if(void 0===f.rolltype)return null;if(void 0===f.coachchoices.listdices)return null;var g=ROLL_TYPES[f.rolltype];return null===g?null:g?g.ignore(b,d,f)?null:new g(g.argsFromXML(a,b,c,d,e,f)):(console.warn("Unknown roll "+f.rolltype,{stepIndex:a,replaystep:b,actionIndex:c,action:d,resultIndex:e,boardactionresult:f}),null)}}]),a}(),BlockRoll=function(a){var c=Math.max;function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"value",value:function value(a){return c.apply(Math,_toConsumableArray(a.map(b.dieValue)))}},{key:"simulateDice",value:function simulateDice(){return this.dice.map((function(){return sample([ATTACKER_DOWN,BOTH_DOWN,PUSH,PUSH,DEFENDER_STUMBLES,DEFENDER_DOWN])}))}},{key:"expectedValue",get:function get(){var a;return a=1==this.dice.length?BLOCK.values.map(b.dieValue):TWO_DIE_BLOCK.values.map((function(a){return c(b.dieValue(a[0]),b.dieValue(a[1]))})),a.reduce((function(c,a){return c+a}),0)/a.length}}],[{key:"dice",value:function(a){var c=_get(_getPrototypeOf(b),"dice",this).call(this,a);return c.slice(0,c.length/2).map(b.asBlockDie)}},{key:"ignore",value:function ignore(a,b,c){return 2!=c.resulttype}},{key:"asBlockDie",value:function asBlockDie(a){return 0===a?ATTACKER_DOWN:1===a?BOTH_DOWN:2===a?PUSH:3===a?DEFENDER_STUMBLES:4===a?DEFENDER_DOWN:void 0}},{key:"dieValue",value:function dieValue(a){return a===ATTACKER_DOWN?-1:a===BOTH_DOWN?-.75:a===PUSH?.25:a===DEFENDER_STUMBLES?.75:a===DEFENDER_DOWN?1:void 0}}]),b}(Roll);_defineProperty(BlockRoll,"rollName","Block");var FansRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(Roll),ModifiedD6SumRoll=function(a){var c=Math.max;function b(a){var c,d=a.target,e=a.modifier,f=_objectWithoutProperties(a,["target","modifier"]);return _classCallCheck(this,b),c=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this,f)),c.target=d,c.modifier=e,c}return _inherits(b,a),_createClass(b,[{key:"value",value:function value(a){return a.reduce((function(c,a){return c+a}),0)>=this.modifiedTarget?this.passValue:this.failValue}},{key:"simulateDice",value:function simulateDice(){return this.dice.map((function(){return sample([1,2,3,4,5,6])}))}},{key:"modifiedTarget",get:function get(){var a=Math.min;return 1==this.dice.length?a(6,c(2,this.target-this.modifier)):this.target-this.modifier}},{key:"expectedValue",get:function get(){for(var a,b=[0],c=0;c<this.dice.length;c++){a=[];for(var d=1;6>=d;d++){var e=!0,f=!1,g=void 0;try{for(var h,i,j=b[Symbol.iterator]();!(e=(h=j.next()).done);e=!0)i=h.value,a.push(i+d)}catch(a){f=!0,g=a}finally{try{e||null==j["return"]||j["return"]()}finally{if(f)throw g}}}b=a}for(var k,l=b.length,m=0,n=0,o=b;n<o.length;n++)k=o[n],m+=k>=this.modifiedTarget?this.passValue/l:this.failValue/l;return m}}],[{key:"argsFromXML",value:function argsFromXML(a,c,d,e,f,g){var h=_get(_getPrototypeOf(b),"argsFromXML",this).call(this,a,c,d,e,f,g);return h.modifier=ensureList(g.listmodifiers.dicemodifier||[]).map((function(a){return a.value})).reduce((function(c,a){return c+a}),0)||0,h.target=g.requirement,h}}]),b}(Roll),PickupRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(PickupRoll,"rollName","Pickup"),_defineProperty(PickupRoll,"passValue",1),_defineProperty(PickupRoll,"failValue",-1);var ArmorRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(ArmorRoll,"rollName","Armor"),_defineProperty(ArmorRoll,"passValue",-1),_defineProperty(ArmorRoll,"failValue",0);var WildAnimalRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(WildAnimalRoll,"rollName","Wild Animal"),_defineProperty(WildAnimalRoll,"passValue",0),_defineProperty(WildAnimalRoll,"failValue",-1);var DauntlessRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(DauntlessRoll,"rollName","Dauntless"),_defineProperty(DauntlessRoll,"passValue",1),_defineProperty(DauntlessRoll,"failValue",-1);var DodgeRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(DodgeRoll,"rollName","Dodge"),_defineProperty(DodgeRoll,"passValue",1),_defineProperty(DodgeRoll,"failValue",-1);var JumpUpRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(JumpUpRoll,"rollName","Jump Up"),_defineProperty(JumpUpRoll,"passValue",1),_defineProperty(JumpUpRoll,"failValue",0);var PassRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(PassRoll,"rollName","Pass"),_defineProperty(PassRoll,"passValue",1),_defineProperty(PassRoll,"failValue",-1);var InterceptionRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(InterceptionRoll,"rollName","Interception"),_defineProperty(InterceptionRoll,"passValue",1),_defineProperty(InterceptionRoll,"failValue",0);var WakeUpRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(WakeUpRoll,"rollName","Wake Up"),_defineProperty(WakeUpRoll,"passValue",1),_defineProperty(WakeUpRoll,"failValue",-1);var GFIRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(GFIRoll,"rollName","GFI"),_defineProperty(GFIRoll,"passValue",0),_defineProperty(GFIRoll,"failValue",-1);var CatchRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),b}(ModifiedD6SumRoll);_defineProperty(CatchRoll,"rollName","Catch"),_defineProperty(CatchRoll,"passValue",1),_defineProperty(CatchRoll,"failValue",-1);var InjuryRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"injuryValue",value:function injuryValue(a){return 7>=a?0:9>=a?-.5:-1}},{key:"value",value:function value(a){var b=a[0]+a[1];return this.injuryValue(b)}},{key:"simulateDice",value:function simulateDice(){return this.dice.map((function(){return sample([1,2,3,4,5,6])}))}},{key:"expectedValue",get:function get(){for(var a=0,b=1;6>=b;b++)for(var c=1;6>=c;c++)a+=this.injuryValue(b+c);return a/36}}]),b}(Roll);_defineProperty(InjuryRoll,"rollName","Injury");var CasualtyRoll=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"value",value:function value(a){return 30>=a?0:40==a?-.5:50==a?-.75:-1}},{key:"simulateDice",value:function simulateDice(){return 10*sample([1,2,3,4,5,6])+sample([1,2,3,4,5,6,7,8])}},{key:"expectedValue",get:function get(){for(var a=0,b=1;6>=b;b++)for(var c=1;8>=c;c++)a+=this.value(10*b+c);return a/48}}],[{key:"dice",value:function(a){var c=_get(_getPrototypeOf(b),"dice",this).call(this,a);return c=c.slice(0,c.length/2),[c[c.length-1]]}}]),b}(Roll);_defineProperty(CasualtyRoll,"rollName","Casualty");var ROLL_TYPES={1:GFIRoll,2:DodgeRoll,3:ArmorRoll,4:InjuryRoll,5:BlockRoll,7:PickupRoll,8:CasualtyRoll,9:CatchRoll,10:null,11:null,12:PassRoll,13:null,14:null,16:InterceptionRoll,17:WakeUpRoll,22:WildAnimalRoll,26:null,29:DauntlessRoll,31:JumpUpRoll,58:null,59:ArmorRoll,60:InjuryRoll,63:null,70:null};