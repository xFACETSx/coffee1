import { useState, useEffect } from 'react'
import { CoffeeType } from '../../constants'

import styles from './StockPage.module.css'
import css from 'classnames'
import { Stock } from '../../components/Stock/Stock'

import { CgSearch } from 'react-icons/cg'

import { Select, Input } from 'antd'

/*import img7 from '../../picture/img7.jpeg'
import img8 from '../../picture/img8.jpeg'
import img9 from '../../picture/img19.jpeg'
import img13 from '../../picture/img13.jpeg'
import img17 from '../../picture/img17.jpeg'*/
import axios from 'axios'

const { Option } = Select

export function StockPage() {
  const [stockList, setStockList] = useState([])
  const [filterStockList, setFilterStockList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterBy, setFilterBy] = useState('')
  const [sortBy, setSortBy] = useState('recommend')

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_BACKEND + '/menus')
      setStockList(data)
      setFilterStockList(data)
    } catch (error) {
      alert('Error')
    }
  }

  const onSearch = () => {
    const result = stockList
      .filter((stock) => (filterBy ? stock.stock_type === filterBy : true)) //filter type
      .filter((stock) =>
        stock.stock_name.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => {
        //a-b น้อยไปมาก
        switch (sortBy) {
          case 'recommend':
            return b.isRecommend - a.isRecommend
          case 'popular':
            return b.rate - a.rate
          case 'new':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          case 'low':
            return a.price - b.price
          case 'high':
            return b.price - a.price
        }
      })
    setFilterStockList(result)
    console.log(result)
  }

  useEffect(() => {
    onSearch()
  }, [filterBy, sortBy])

  useEffect(() => {
    fetchMenus()
  }, [])

  return (
    <div>
      <div className={styles.coverHeader}>
        <div className={styles.imgHeader}></div>
        <h4 className={styles.textHeader}>STOCK</h4>
      </div>
      <div className={styles.bgColor}>
        <div className={styles.container}>
          <div className={styles.coverFunction}>
            <Input
              placeholder="search stock"
              prefix={<CgSearch />}
              className={styles.search}
              style={{ width: 200 }}
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  onSearch()
                }
              }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <div className={styles.coverFilterAndSort}>
              <div>
                <span className={styles.text}>Filter by</span>
                <Select
                  className={styles.filterFunction}
                  value={filterBy}
                  onChange={(value) => setFilterBy(value)}
                >
                  <Option value="">All</Option>
                  <Option value={CoffeeType.COFFEE}>Coffee</Option>
                  <Option value={CoffeeType.MILK}>Milk</Option>
                  <Option value={CoffeeType.SODA}>Soda</Option>
                </Select>
              </div>

              <div>
                <span className={styles.text}>Sort by</span>
                <Select
                  className={styles.sortFunction}
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                >
                  <Option value="recommend">Recommend</Option>
                  <Option value="low">Price low - high</Option>
                  <Option value="high">Price high - low</Option>
                  <Option value="popular">Popularity</Option>
                  <Option value="new">Newest</Option>
                </Select>
              </div>
            </div>
          </div>
          <div className={styles.stockList}>
            {filterStockList.map((eachData) => (
              <Stock data={eachData} key={eachData.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
