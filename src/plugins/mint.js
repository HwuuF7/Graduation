import Vue from 'vue'
import {
    Button,
    Navbar,
    TabItem,
    TabContainer,
    TabContainerItem,
    Swipe,
    SwipeItem,
    Tabbar,
    InfiniteScroll,
    Spinner,
    Toast,
    Indicator,
    Cell,
    Header,
    Field,
    Radio,
    MessageBox,
    Actionsheet,
    Popup,
    Switch,
    Checklist,
    Search
} from 'mint-ui'

Vue.component(Button.name, Button);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Tabbar.name, Tabbar);
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);
Vue.component(Cell.name, Cell);
Vue.component(Header.name, Header);
Vue.component(Field.name, Field);
Vue.component(Radio.name, Radio);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Popup.name, Popup);
Vue.component(Switch.name, Switch);
Vue.component(Checklist.name, Checklist);
Vue.component(Search.name, Search);
// Vue.component(Toast.name, Toast);
// Vue.use(Button)
Vue.prototype.$toast = Toast;
Vue.prototype.$indicator = Indicator;
Vue.prototype.$message = MessageBox;