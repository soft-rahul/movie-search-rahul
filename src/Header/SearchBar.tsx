import { BsFillSearchHeartFill } from "react-icons/bs";

const SearchBar = (props: { searchQuery: string; onSearchChange: any }) => {
  return (
    <div className="searchBar">
      <div>
        <BsFillSearchHeartFill />
      </div>
      <div className="search">
        <input
          type="text"
          value={props.searchQuery}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="Search for something.."
        />
      </div>
    </div>
  );
};

export default SearchBar;
