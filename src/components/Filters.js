import filtersStyles from "../styles/Filters.module.css";

export default function Filters() {
  return (
    <div className={filtersStyles.filters}>
      <input
        type="text"
        className={filtersStyles.filtersSearch}
        id="search"
        placeholder="Search by ENS or Twitter name..."
        autocomplete="off"
      />
      <div className={filtersStyles.filtersCol}>
        <div>
          <label>Verified on Twitter</label>
          <div className={filtersStyles.filtersOptions}>
            <div className={filtersStyles.filtersOption}>
              <input
                type="radio"
                name="verified"
                id="verified-all"
                value="all"
                checked
              />
              <label for="verified-all">All</label>
            </div>
            <div className={filtersStyles.filtersOption}>
              <input
                type="radio"
                name="verified"
                id="verified-yes"
                value="yes"
              />
              <label for="verified-yes">Yes</label>
            </div>
            <div className={filtersStyles.filtersOption}>
              <input type="radio" name="verified" id="verified-no" value="no" />
              <label for="verified-no">No</label>
            </div>
          </div>
        </div>
        <div>
          <label>ENS Avatar</label>
          <div className={filtersStyles.filtersOptions}>
            <div className={filtersStyles.filtersOption}>
              <input
                type="radio"
                name="avatar"
                id="avatar-all"
                value="all"
                checked
              />
              <label for="avatar-all">All</label>
            </div>
            <div className={filtersStyles.filtersOption}>
              <input type="radio" name="avatar" id="avatar-yes" value="yes" />
              <label for="avatar-yes">Yes</label>
            </div>
            <div className={filtersStyles.filtersOption}>
              <input type="radio" name="avatar" id="avatar-no" value="no" />
              <label for="avatar-no">No</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
