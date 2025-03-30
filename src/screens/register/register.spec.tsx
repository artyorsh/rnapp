import { fireEvent, render } from "@testing-library/react-native";
import { IRegisterVM, Register } from "./register.component";
import { Login } from "../login/login.component";

describe('Register Component', () => {

  let vm: IRegisterVM;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    vm = {
      title: 'Register Title',
      submit: jest.fn(),
      goBack: jest.fn(),
    };
  });

  it('should render without initial values', () => {
    const api = render(<Register vm={vm} />);

    expect(api.getByTestId('email-input').props.value).toBe('');
    expect(api.getByTestId('password-input').props.value).toBe('');
  });

  it('should call submit with correct values', () => {
    const api = render(<Register vm={vm} />);

    fireEvent.changeText(api.getByTestId('email-input'), 'test2@test.com');
    fireEvent.changeText(api.getByTestId('password-input'), 'password2');

    fireEvent.press(api.getByTestId('submit-button'));

    expect(vm.submit).toHaveBeenCalledWith({ email: 'test2@test.com', password: 'password2' });
  });
});