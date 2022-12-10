import styles from "./Home.module.scss";
import locations from "../data/locations.json";
import { ReactElement, useEffect, useState } from "react";
import Fuse from "fuse.js";

type Location = {
  code: number;
  shop: string;
  address: string;
};

const options = {
  minMatchCharLength: 2,
  keys: [
    { name: "code", weight: 0.7 },
    { name: "shop", weight: 0.3 },
    { name: "address", weight: 0.5 },
  ],
};

const fuse = new Fuse<Location>([], options);

export default function Home() {
  const [data, setData] = useState<Location[]>(() => {
    return locations.sort((a: Location, b: Location) => a.code - b.code);
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fuse.setCollection(locations);
  }, [data]);

  useEffect(() => {
    const items = fuse.search(filter).map((item) => item.item);
    if (filter.length === 0) {
      setData(locations);
      return;
    }

    setData(items);
  }, [filter]);

  function getRows(): React.ReactNode {
    return data.map((location: Location): React.ReactNode => {
      return (
        <tr key={location.code + location.shop}>
          <td>
            <b>{location.code}</b>
          </td>
          <td>
            <b>{location.shop}</b>
          </td>
          <td>
            <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${location.address}`}>
              {location.address}
            </a>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className={styles.content}>
      <input type="text" placeholder="Search" onChange={(e) => setFilter(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Shop</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>{getRows()}</tbody>
      </table>
    </div>
  );
}
