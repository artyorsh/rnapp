import { render } from "@testing-library/react-native";
import { ISplashVM, Splash } from "./splash.component";

describe('Splash Component', () => {
  
  let vm: ISplashVM;

  beforeEach(() => {
    vm = {
      title: 'Splash Title',
    };
  });

  it('should render with correct title', () => {
    const api = render(<Splash vm={vm} />);
    expect(api.getByText('Splash Title')).toBeTruthy();
  });
});
