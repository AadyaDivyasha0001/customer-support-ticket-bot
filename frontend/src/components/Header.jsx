import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function Header({
  activePage,
  setActivePage,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);

    const search =
      value.toLowerCase();

    if (
      search.includes("ticket")
    ) {
      setActivePage("tickets");
    } else if (
      search.includes("customer")
    ) {
      setActivePage("customers");
    } else if (
      search.includes("agent")
    ) {
      setActivePage("agents");
    } else if (
      search.includes("analytics")
    ) {
      setActivePage("analytics");
    } else if (
      search.includes("dashboard")
    ) {
      setActivePage("dashboard");
    }
  };

  return (
    <div className="header enterprise-header">
      <div className="search-container enterprise-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search tickets, customers, agents..."
          value={searchTerm}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
        />
      </div>
    </div>
  );
}

export default Header;