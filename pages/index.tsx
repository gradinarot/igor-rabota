import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import locations from "../data/locations.json";
import styles from "./Home.module.scss";

type Location = {
  code: number;
  shop: string;
  name: string;
  address?: string;
};

const sorted = locations.sort((a: Location, b: Location) => a.code - b.code);

const options = {
  minMatchCharLength: 2,
  keys: [
    { name: "code", weight: 0.7 },
    { name: "shop", weight: 0.3 },
    { name: "name", weight: 0.5 },
  ],
};

const fuse = new Fuse<Location>([], options);

export default function Home() {
  const [data, setData] = useState<Location[]>(sorted);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fuse.setCollection(locations);
  }, [data]);

  useEffect(() => {
    if (filter.length === 0) {
      setData(locations);
      return;
    }

    const items = fuse.search(filter).map((item) => item.item);
    setData(items);
  }, [filter]);

  function getRows(): React.ReactNode {
    return data.map((location: Location): React.ReactNode => {
      return (
        <tr key={location.code + location.shop}>
          <td>
            <b>{location.code}</b>
          </td>
          <td className={styles.shop}>
            <b>{location.shop}</b>
          </td>
          <td>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/place/${location.address || location.name}`}
            >
              {location.name}
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
            <th className={styles.shop}>Shop</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{getRows()}</tbody>
      </table>
    </div>
  );
}
