import { render, screen } from '@testing-library/react';
import ListItem from './ListItem'

test('renders test to do', () => {
  const testTodo = { text: 'Test ListItem', done: false }
  const dummyFunction = (todo) => null

  render(<ListItem todo={testTodo} onClickDelete={dummyFunction} onClickComplete={dummyFunction} />);
  const linkElement = screen.getByText(testTodo.text);
  expect(linkElement).toBeInTheDocument();
});
