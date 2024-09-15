import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export async function fetchData(url: string) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export default function Index() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData("http://192.168.100.199:3000");
      setData(data);
    };
    fetch();
  }, []);
  const sales = Object.values(data).flat();
  console.log(sales);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>test</Text>
      {sales.map((sale: any, index: number) => (
        <Text key={index}>{sale.id}</Text>
      ))}
    </View>
  );
}
