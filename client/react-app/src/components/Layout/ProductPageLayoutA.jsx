import { Layout, Image } from "antd";
import React from "react";
import { Center, Box, WrapItem, Wrap } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProductPageA from "./ProductPageA";
import HeaderNotice from "components/Notification/HeaderNotice";

const { Content } = Layout;
const { Header } = Layout;

const ProductPageLayoutA = (props) => (
  <Layout>
    <Layout>
      <Center>
        <Content
          style={{
            marginTop: "0px",
            minHeight: "800px",
            width: "auto",
            backgroundColor: "black",
          }}
        >
          <Layout>
          <Header
                style={{
                  backgroundColor: "black",
                  textAlign: "center",
                  width: "100%",
//                  height: "50px",
                }}
              >
                <Center>
                  <Image width={300} src="https://buny.us-southeast-1.linodeobjects.com/TheBunyProject-white.png"/>
                </Center>
              </Header>

            <Content
              style={{
                backgroundColor: "#f6ccd0",
                width: "100%",
              }}
            >
   
              <Wrap spacing="5px" justify="center">
                <WrapItem>
                  <Center>
                    <Box>
                      <Link to={"/nft-marketplace"}>
                        <ArrowBackIcon />
                        Back
                      </Link>
                    </Box>
                  </Center>
                </WrapItem>
              </Wrap>
              <Center w="auto" bg="#b4dde3" border="0px solid #fe9d97">
                <Wrap>
                  <WrapItem>
                    <ProductPageA />
                  </WrapItem>
                </Wrap>
              </Center>
    
            </Content>
          </Layout>
        </Content>
      </Center>
    </Layout>
  </Layout>
);

export default ProductPageLayoutA;
