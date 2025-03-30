import { fireEvent, render } from "@testing-library/react-native";
import { ILoginVM, Login } from "./login.component";

describe('Login Component', () => {

  let vm: ILoginVM;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    vm = {
      title: 'Login Title',
      initialValues: {
        email: '',
        password: '',
      },
      submit: jest.fn(),
      goBack: jest.fn(),
    };
  });

  it('should render with initial email and password', () => {
    vm.initialValues = {
      email: 'test@test.com',
      password: 'password',
    };

    const api = render(<Login vm={vm} />);

    expect(api.getByTestId('email-input').props.value).toBe('test@test.com');
    expect(api.getByTestId('password-input').props.value).toBe('password');
  });

  it('should call submit with initial values', () => {
    vm.initialValues = {
      email: 'test@test.com',
      password: 'password',
    };

    const api = render(<Login vm={vm} />);

    fireEvent.press(api.getByTestId('submit-button'));

    expect(vm.submit).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });

  it('should call submit with updated email and password', () => {
    const api = render(<Login vm={vm} />);

    fireEvent.changeText(api.getByTestId('email-input'), 'test2@test.com');
    fireEvent.changeText(api.getByTestId('password-input'), 'password2');

    fireEvent.press(api.getByTestId('submit-button'));

    expect(vm.submit).toHaveBeenCalledWith({ email: 'test2@test.com', password: 'password2' });
  });
});