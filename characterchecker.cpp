#include<iostream>
using namespace std;
int main(){
    char ch;
    cin>>ch;
    if((ch>='A'&& ch<='Z') || (ch>='a' && ch<='z')){
        cout<<"It's a Alphabet"<<endl;
    }
    else if(ch>='0' && ch<='9'){
        cout<<"It's a digit"<<endl;
    }
    else{
        cout<<"It's a special character"<<endl;
    }
    return 0;
}