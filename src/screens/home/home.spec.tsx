import { render, waitFor } from "@testing-library/react-native";
import { Home, IHomeVM } from "./home.component";
import { IHomeOptions } from "./home.vm";
import { HomeVM } from "./home.vm";
import { INavigationScreenLifecycle } from "../../service/navigation/components/navigation-screen.container";

describe('Home Component', () => {

  let vm: IHomeVM;

  beforeEach(() => {
    vm = {
      title: 'Home',
      logout: jest.fn(),
    };
  });

  it('should render with given title', () => {
    const api = render(<Home vm={vm} />);
    expect(api.getByText('Home')).toBeTruthy();
  });

  it('should call logout', () => {
    vm.logout();
    expect(vm.logout).toHaveBeenCalled();
  });

});

describe('Home VM', () => {
  let vm: IHomeVM;

  const lifecycle: INavigationScreenLifecycle = {
    subscribe: jest.fn(listener => listener.onMount?.()),
  };

  const deps: IHomeOptions = {
    session: jest.requireMock('../../service/session/session.service').SessionService(),
    navigation: jest.requireMock('../../service/navigation/navigation.service').NavigationService(),
  };

  beforeEach(() => {
    vm = new HomeVM(lifecycle, deps);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should navigate to welcome screen if logout is successful', async () => {
    vm.logout();

    await waitFor(() => {
      expect(deps.navigation.replace).toHaveBeenCalledWith('/welcome');
    });
  });

  it('should not navigate if logout is unsuccessful', async () => {
    deps.session.logout = jest.fn(() => Promise.reject());
    vm = new HomeVM(lifecycle, deps);

    vm.logout();

    await waitFor(() => {
      expect(deps.navigation.replace).not.toHaveBeenCalled();
    });
  });
});