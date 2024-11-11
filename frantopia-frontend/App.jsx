import { Provider } from "react-redux";
import "./global.css";
import AppNavigator from './src/presentation/navigation/AppNavigation';
import store from "./src/infrastructure/redux/store";

const App = () =>
{
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
    
  );
};

export default App;