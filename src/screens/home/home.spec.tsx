import { render } from "@testing-library/react-native";
import { Home, IHomeVM } from "./home.component";

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
