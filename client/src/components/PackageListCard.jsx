import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "./ButtonCustom";
import styles from "../style";
import { merryButton } from "../assets/indexAsset";

const ItemType = "TABLE_CARD";

const TableCard = ({ data, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: data.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.id !== data.id) {
        onDrop(item.id, data.id);
        item.id = data.id; // Update item id to trackNumber of the new position
      }
    },
  });

  return (
    <tr ref={(node) => drag(drop(node))} key={data.id}>
      <td>
        <img src={merryButton} alt="" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.trackNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap"></td>
    </tr>
  );
};

const PackageListCard = () => {
  const initialTableData = [
    {
      id: 2,
      trackNumber: "1",
      packageName: "Pray for me",
      limit: "Black Panther",
      createdDate: "4:39",
      updatedDate: "1.8 Billion",
      iconSrc: "./img/the-weekend.jpg",
    },
    {
      id: 3,
      trackNumber: "2",
      packageName: "Perfect",
      limit: "Divide",
      createdDate: "3:29",
      updatedDate: "2.7 Billion",
      iconSrc: "./img/ed-shreen.jpg",
    },
    {
      id: 4,
      trackNumber: "3",
      packageName: "Perfect",
      limit: "Divide",
      createdDate: "3:29",
      updatedDate: "2.7 Billion",
      iconSrc: "./img/ed-shreen.jpg",
    },
    {
      id: 7,
      trackNumber: "4",
      packageName: "Perfect",
      limit: "Divide",
      createdDate: "3:29",
      updatedDate: "2.7 Billion",
      iconSrc: "./img/ed-shreen.jpg",
    },
  ];

  const [tableData, setTableData] = useState(initialTableData);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredTableData = tableData.filter((item) => {
    return item.packageName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDrop = (draggedId, targetId) => {
    // Swap the positions of the dragged and dropped items
    const draggedIndex = tableData.findIndex((item) => item.id === draggedId);
    const targetIndex = tableData.findIndex((item) => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const updatedTableData = [...tableData];
      const draggedItem = { ...updatedTableData[draggedIndex] };
      const targetItem = { ...updatedTableData[targetIndex] };

      // Swap the positions of the dragged and dropped items
      updatedTableData[draggedIndex] = targetItem;
      updatedTableData[targetIndex] = draggedItem;

      // Update the trackNumber based on the new positions
      updatedTableData.forEach((item, index) => {
        item.trackNumber = (index + 1).toString();
      });

      // Update the state with the new table data
      setTableData(updatedTableData);
    }
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <section className={` ${styles.paddingMin} bg-white`}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <Button label="+Add Package" />
        </section>

        <section className="my-10">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:px-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-md bg-white rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>{/* Table header */}</thead>
                    <tbody className="bg-white" id="list_item">
                      {filteredTableData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* Add TableCard here */}
                            <TableCard
                              key={item.id}
                              data={item}
                              onDrop={handleDrop}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600 leading-5 px-2 inline-flex">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={item.iconSrc}
                                alt={item.packageName}
                              />
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-700 capitalize">
                                  {item.packageName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 capitalize">
                              {item.limit}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600 leading-5 px-2 inline-flex">
                              {item.createdDate}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-purple-700 capitalize">
                              {item.updatedDate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </DndProvider>
    </>
  );
};

export default PackageListCard;
