import { Input } from "antd";
const { Search } = Input;

const SearchBar = ({ type }) => {
  const onSearch = (value) => console.log(value);
  return (
    <Search
      className="w-70"
      placeholder={`Search for ${type}...`}
      onSearch={onSearch}
      allowClear
      enterButton
    />
  );
};
export default SearchBar;
