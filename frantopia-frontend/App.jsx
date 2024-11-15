import { Provider } from "react-redux";
import { Provider as PaperProvider }  from "react-native-paper";
import "./global.css";
import AppNavigator from './src/presentation/navigation/AppNavigation';
import store from "./src/infrastructure/redux/store";

const App = () =>
{
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;