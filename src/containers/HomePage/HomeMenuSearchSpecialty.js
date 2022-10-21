import React from "react";
import { useHistory } from "react-router-dom";
import { getAllSpecialty } from "../../services/userService";
import './HomeMenuSearchSpecialty.scss'
import { FormattedMessage } from "react-intl";
import { useEffect } from "react";
import { useState } from "react";

const HomeMenuSearchSpecialty = (props) => {
  let history = useHistory();
  const [dataSpecialty, setDataSpecialty] = useState([])
  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const fetchDataGetAllSpecialty = async () => {
      if (dataSpecialty.length !== 0) return;
      let res = await getAllSpecialty();
      if (res && res.errCode === 0) {
        let data = res.data ? res.data : [];
        setDataSpecialty(data);
      }
    };
    fetchDataGetAllSpecialty();
  }, []);

  const findIdSpecialtyByName = (itemName) => {

    let item = dataSpecialty.find((element) => element.name === itemName);
    console.log('check element', item);

    return item.id;

  };

  const handleViewDetail = (itemName) => (event) => {
    let id = findIdSpecialtyByName(itemName);
    if (history) {
      history.push(`/detail-specialty/${id}`);
    }
  };

  const handleFilter = (event) => {
    console.log('check onchange input >>', event.target.value)
    const searchWord = event.target.value;
    const newFilter = dataSpecialty.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === '') {
      setFilterData([])
    } else {
      setFilterData(newFilter)
    }

  }


  console.log('check filter data', filterData)
  return (
    <>
      <div className="search">
        <i className="fas fa-search"></i>
        <FormattedMessage id="banner.search">
          {(placeholder) => (
            <input type="text" placeholder={placeholder} onChange={handleFilter} />
          )}
        </FormattedMessage>

      </div>

      {filterData.length !== 0 &&
        <div className="dataResult">
          {filterData.map((option, idx) => {
            return <a key={option.id} onClick={handleViewDetail(option.name)}>{option.name}</a>
          })
          }
        </div>
      }

    </>
  )
}

export default HomeMenuSearchSpecialty;
